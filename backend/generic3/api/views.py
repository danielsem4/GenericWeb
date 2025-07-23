from django.shortcuts import get_object_or_404, render
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.db.models import Q

from clinics.models import Clinic, ClinicModules, Modules
from generic3.utils import get_clinic_id_for_user
from users.models import User
from users.serializers import UserSerializer



#### Login through the REST_API_JWT
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    
    default_url = "https://generic2dev.hitheal.org.il"
    site = "https://{}".format(request.get_host())

    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({"detail": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    user = get_object_or_404(User, email=email)
    if not user.check_password(password):
        return Response({"detail":"Invalid user or password"}, status=status.HTTP_404_NOT_FOUND)
    
    token,created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    clinics_id = get_clinic_id_for_user(user) # could be multiple clinics for a user
    print("Clinics ID:", clinics_id)
    modules = []
    clinic_data = {}

    if len(clinics_id) == 0:
        return Response({"detail":"No clinics found for this user"}, status=status.HTTP_404_NOT_FOUND)
    if len(clinics_id) > 1:
        user_clinics_urls = Clinic.objects.filter(id__in=clinics_id).values_list('clinic_url' , flat=True)
        if site not in user_clinics_urls:
            return Response({"detail":"Multiple clinics found for this user", "clinics": list(user_clinics_urls)}, status=status.HTTP_202_ACCEPTED)
    else:
        clinic_id = clinics_id[0]
        
    clinics_data = Clinic.objects.filter(id=clinic_id).values_list('id','clinic_url','clinic_name')
    
    clinic_modules = ClinicModules.objects.filter(clinic_id=clinic_id).exclude(Q(module_id__in=[1, 2])).values_list('module_id', flat=True)
    if clinic_modules:
        modules = Modules.objects.filter(id__in=clinic_modules).values_list('module_name', 'id')

    data = serializer.data

    user_data = {
        'clinicId': clinic_id,
        'clinicName': clinics_data[0][2] if clinics_data else None,
        'modules': modules,
        'status': 'Success',
        'server_url': clinics_data[0][1] if clinics_data else default_url
    }
    data.update(user_data)
    return Response({"token":token.key,"user":data}) 

