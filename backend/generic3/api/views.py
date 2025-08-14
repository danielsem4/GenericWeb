from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.conf import settings
from django.contrib.staticfiles import finders
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import logging
from rest_framework_simplejwt.tokens import RefreshToken
from clinics.models import Clinic, ClinicModules, Modules
from generic3.utils import get_clinic_id_for_user
from users.models import User
from users.serializers import UserSerializer

logger = logging.getLogger(__name__)

#### Login through Django Session Authentication
# This function handles user login, creates a session, and returns user details if successful.

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    
    default_url = "https://generic2dev.hitheal.org.il"
    site = f"http://{request.get_host()}"

    email = request.data.get('email')
    password = request.data.get('password')
    print(f"Login attempt for email: {email} at site: {site}")
    
    if not email or not password:
        return Response({"detail": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Use Django's built-in authentication
    user = authenticate(request, username=email, password=password)
    if not user:
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    
    # # Create or get token for API authentication
    # token, created = Token.objects.get_or_create(user=user)
    
    # create JWT pair
    tokens = RefreshToken.for_user(user)

    # Get user data
    serializer = UserSerializer(instance=user)
    clinics_id = get_clinic_id_for_user(user)
    clinic_data = None
    clinic_image = f'{site}/static/images/default.png'
    modules = []

    logger.info(f"User {user.email} login attempt - Clinics: {clinics_id}")
    
    if not clinics_id:
        return Response({"detail": "No clinics found for this user"}, status=status.HTTP_403_FORBIDDEN)
    
    # Handle multiple clinics case
    if len(clinics_id) > 1:
        user_clinics_urls = Clinic.objects.filter(id__in=clinics_id).values_list('clinic_url', flat=True)
        if site not in user_clinics_urls:
            return Response({
                "detail": "Multiple clinics found for this user", 
                "clinics": list(user_clinics_urls)
            }, status=status.HTTP_202_ACCEPTED)
        # If site matches one of the clinics, find the corresponding clinic_id
        clinic_id = Clinic.objects.filter(clinic_url=site, id__in=clinics_id).first().id
    else:
        clinic_id = clinics_id[0]
    
    if not user.is_staff:
        # Get clinic data more efficiently
        try:
            clinic = Clinic.objects.get(id=clinic_id)
            clinic_data = {
                'id': clinic.id,
                'url': clinic.clinic_url,
                'name': clinic.clinic_name
            }
        except Clinic.DoesNotExist:
            return Response({"detail": f"Clinic not found with id {clinic_id} and site: {site}"}, status=status.HTTP_404_NOT_FOUND)
        
        # Get modules for the clinic
        clinic_modules = ClinicModules.objects.filter(
            clinic_id=clinic_id
        ).values_list('module_id', flat=True)
        
        if clinic_modules:
            modules = list(Modules.objects.filter(
                id__in=clinic_modules
            ).values_list('module_name', 'id'))
            
        clinic_name = clinic_data['name']
        try:
            # Check if static file exists
            static_file_path = f'images/{clinic_name}.png'
            file_exists = finders.find(static_file_path) is not None
        except Exception as e:
            print("Error checking file existence:", e)
            file_exists = False
        
        if file_exists:
            clinic_image = f'{site}/static/images/{clinic_name}.png'

    data = serializer.data
    user_data = {
        'clinicId': clinic_id if clinic_id else None,
        'clinicName': clinic_data['name'] if clinic_data else None,
        'clinic_image': clinic_image,
        'modules': [{'name': module[0], 'id': module[1]} for module in modules] if modules else [],
        'status': 'Success',
        'server_url': clinic_data['url'] if clinic_data else default_url,
    }
    data.update(user_data)

    print(f"User {user.email} logged in successfully with clinic {clinic_data['name'] if clinic_data else 'N/A'}")
    
    response =  Response({"user": data}) 
    
    # -- set cookies --
    response.set_cookie(
        "access",
        str(tokens.access_token),
        max_age=60 * 60,          # 60 min
        httponly=True,
        secure=True,
        samesite="None",
        path="/",
    )
    response.set_cookie(
        "refresh",
        str(tokens),
        max_age=24 * 60 * 60,     # 1 day
        httponly=True,
        secure=True,
        samesite="None",
        path="/auth/refresh/",    # only sent to the refresh endpoint
    )
    return response


@api_view(["POST"])
@permission_classes([AllowAny])
def refresh_token(request):
    refresh = request.COOKIES.get("refresh")
    if refresh is None:
        return Response({"detail": "No refresh cookie"}, status=401)

    try:
        token = RefreshToken(refresh)
        new_access = token.access_token
    except Exception:
        return Response({"detail": "Invalid refresh token"}, status=401)

    response = Response({"detail": "refreshed"})
    response.set_cookie(
        "access",      
        str(new_access),
        max_age=60 * 60,
        httponly=True,
        secure=True,
        samesite="None",
        path="/",
    ) 
    return response  

@api_view(['POST'])
def logout(request):
    """
    Logout user and delete token
    """
    if request.user.is_authenticated:
        print(f"User {request.user.email} logging out")
        # Delete the user's token to log them out
        try:
            token = Token.objects.get(user=request.user)
            token.delete()
        except Token.DoesNotExist:
            pass
        return JsonResponse({'message': 'Logged out successfully'})
    else:
        return JsonResponse({'message': 'User was not logged in'}, status=400)

@api_view(['POST'])
def add_module(request):
    """
    Add a module to the clinic
    """
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'Authentication credentials were not provided.'}, status=401)
    if not request.user.is_staff:
        return JsonResponse({'detail': 'You do not have permission to add modules.'}, status=403)
    
    module_name = request.data.get('module_name')
    if not module_name:
        return JsonResponse({'detail': 'Module name is required.'}, status=400)
    
    try:
        module, created = Modules.objects.get_or_create(module_name=module_name)
        if created:
            return JsonResponse({'detail': f'Module "{module_name}" added successfully.'}, status=201)
        else:
            return JsonResponse({'detail': f'Module "{module_name}" already exists.'}, status=200)

    except Exception as e:
        logger.error(f"Error adding module: {e}")
        return JsonResponse({'detail': 'An error occurred while adding the module.'}, status=500)
    
@api_view(['DELETE'])
def delete_module(request, module_id):
    """
    Delete a module from the clinic
    """
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'Authentication credentials were not provided.'}, status=401)
    if not request.user.is_staff:
        return JsonResponse({'detail': 'You do not have permission to delete modules.'}, status=403)

    try:
        module = Modules.objects.get(id=module_id)
        # Check if the module is associated with any clinics
        if ClinicModules.objects.filter(module=module).exists():
            return JsonResponse({'detail': 'Module cannot be deleted as it is associated with clinics.'}, status=400)
        module.delete()
        return JsonResponse({'detail': f'Module "{module.module_name}" deleted successfully.'}, status=204)
    except Modules.DoesNotExist:
        return JsonResponse({'detail': 'Module not found.'}, status=404)
    except Exception as e:
        logger.error(f"Error deleting module: {e}")
        return JsonResponse({'detail': 'An error occurred while deleting the module.'}, status=500)
