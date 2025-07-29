from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.conf import settings
from django.contrib.staticfiles import finders
import logging

from clinics.models import Clinic, ClinicModules, Modules
from generic3.utils import get_clinic_id_for_user
from users.models import User
from users.serializers import UserSerializer

logger = logging.getLogger(__name__)

#### Login through the REST_API_JWT
# This function handles user login, checks credentials, and returns a token and user details if successful.
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
    
    try:
        user = User.objects.get(email=email)
        if not user.check_password(password):
            raise User.DoesNotExist()
    except User.DoesNotExist:
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    
    token, created = Token.objects.get_or_create(user=user)
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
            return Response({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)
        
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
        'clinic_image' : clinic_image,
        'modules': [{'name': module[0], 'id': module[1]} for module in modules] if modules else [],
        'status': 'Success',
        'server_url': clinic_data['url'] if clinic_data else default_url
    }
    data.update(user_data)
    logger.info(f"User {user.email} logged in successfully with clinic {clinic_data['name'] if clinic_data else 'N/A'}")
    return Response({"token": token.key, "user": data}) 




