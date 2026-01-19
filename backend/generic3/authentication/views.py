from datetime import timedelta
from random import random
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.conf import settings
from django.contrib.staticfiles import finders
from django.utils import timezone
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import logging
from rest_framework_simplejwt.tokens import RefreshToken
from modules.models import ClinicModules, Modules
from clinics.models import Clinic
from generic3.utils import get_clinic_id_for_user, send2FA_code, setup_totp, verify_code
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
        'clinicId': clinic_id if clinic_id else 0,
        'clinicName': clinic_data['name'] if clinic_data else "GenericWeb",
        'clinic_image': clinic_image,
        'modules': [{'name': module[0], 'id': module[1]} for module in modules] if modules else [],
        'status': 'Success',
        'server_url': clinic_data['url'] if clinic_data else default_url,
    }
    data.update(user_data)
    data.update({
        'access_token': str(tokens.access_token),
        'refresh_token': str(tokens)
    })

    print(f"User {user.email} logged in successfully with clinic {user_data['clinicName']}")
    
    response =  Response({"user": data}) 
    
    # -- set cookies --
    is_secure = not settings.DEBUG  # Only use secure cookies in production
    response.set_cookie(
        "access",
        str(tokens.access_token),
        max_age=60 * 60,          # 60 min
        httponly=True,
        secure=is_secure,
        samesite="Lax" if settings.DEBUG else "None",
        path="/",
    )
    response.set_cookie(
        "refresh",
        str(tokens),
        max_age=24 * 60 * 60,     # 1 day
        httponly=True,
        secure=is_secure,
        samesite="Lax" if settings.DEBUG else "None",
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
def authenticate_user(request):
    """
    Authenticate user and handle first login actions.
    """
    email = request.data.get('email')
    send_method = request.data.get('send_method', 'email').lower()  

    if not email:
        return JsonResponse({'error': 'Email is required'}, status=400)

    user = authenticate(request, email=email)
    if user is None:
        return JsonResponse({'error': 'Invalid email or password'}, status=401)

    # Store user session temporarily for 2FA verification
    request.session['pending_2fa_user_id'] = user.id
    request.session['pending_2fa_timestamp'] = timezone.now().isoformat() 

    response = send2FA_code(user, send_method)
    if response.status_code != 200:
        return response

    return JsonResponse({
        'message': 'Credentials verified. Please enter 2FA code.',
        'requires_2fa': True
    }, status=200)

@api_view(['POST'])
def verify_2fa_code(request):
    """
    Verify 2FA code and complete login
    """
    
    code = request.data.get('code')
    code_type = request.data.get('code_type')
    user_id = request.session.get('pending_2fa_user_id')
    
    if not code or not user_id:
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
    # Check if session hasn't expired (5 minutes)
    timestamp_str = request.session.get('pending_2fa_timestamp')
    if timestamp_str:
        from datetime import datetime
        timestamp = datetime.fromisoformat(timestamp_str)
        if timezone.now() - timestamp > timedelta(minutes=5):
            request.session.pop('pending_2fa_user_id', None)
            request.session.pop('pending_2fa_timestamp', None)
            return JsonResponse({'error': '2FA session expired'}, status=400)

    try:
        user = User.objects.get(id=user_id)

        if verify_code(user, code , code_type):
            # Clear pending session
            request.session.pop('pending_2fa_user_id', None)
            request.session.pop('pending_2fa_timestamp', None)
            
            response = JsonResponse({
                'message': '2FA verification successful',
                'user': {'id': user.id, 'email': user.email}
            })

            if code_type == "login":
                # Generate JWT tokens
                tokens = RefreshToken.for_user(user)

                # Set cookies
                response.set_cookie(
                    "access",
                    str(tokens.access_token),
                    max_age=60 * 60,
                    httponly=True,
                    secure=True,
                    samesite="None",
                    path="/",
                )
                response.set_cookie(
                    "refresh",
                    str(tokens),
                    max_age=24 * 60 * 60,
                    httponly=True,
                    secure=True,
                    samesite="None",
                    path="/auth/refresh/",
                )
            
            return response
        else:
            return JsonResponse({'error': 'Invalid or expired 2FA code'}, status=400)
            
    except User.DoesNotExist:
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
@api_view(['POST'])
def password_change(request):
    """
    Change user password to a new password.
    """
    email = request.data.get('email')
    new_password = request.data.get('new_password')
    confirm_new_password = request.data.get('confirm_new_password')

    if not email or not new_password or not confirm_new_password:
        return JsonResponse({'error': 'Email, new password, and confirm new password are required'}, status=400)

    if new_password != confirm_new_password:
        return JsonResponse({'error': 'New password and confirm new password do not match'}, status=400)
    
    user = authenticate(request, email=email)
    if user is None:
        return JsonResponse({'error': 'Invalid email'}, status=401)
    
    if not (8 <= len(new_password) <= 20):
        return JsonResponse({'error': 'Password must be between 8 and 20 characters'}, status=400)
    if not any(char.isdigit() for char in new_password):
        return JsonResponse({'error': 'Password must contain at least one digit'}, status=400)
    if not any(char.isalpha() for char in new_password):
        return JsonResponse({'error': 'Password must contain at least one letter'}, status=400)
    if not any(char in '!@#$%^&*()_+-=[]{}|;:,.<>?/' for char in new_password):
        return JsonResponse({'error': 'Password must contain at least one special character'}, status=400)
    if not any(char in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' for char in new_password):
        return JsonResponse({'error': 'Password must contain at least one uppercase letter'}, status=400)

    user.set_password(new_password)
    user.save()

    return JsonResponse({'message': 'Password changed successfully'}, status=200)
