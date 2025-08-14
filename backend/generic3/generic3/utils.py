from datetime import datetime
from django.http import HttpResponse, JsonResponse
from django.utils import timezone
from django_otp.plugins.otp_totp.models import TOTPDevice
import qrcode
from io import BytesIO
from urllib.parse import quote
import string
import secrets
from rest_framework import status
from users.models import Doctor , ClinicManager, Patient, PatientDoctor, User , sentMessages
from clinics.models import DoctorClinic, ManagerClinic, PatientClinic
from generic3.messages import sendEmailMessage

def generate_temporary_password(length=12):
    characters = string.ascii_letters + string.digits #+ string.punctuation
    password = ''.join(secrets.choice(characters) for i in range(length))
    return password

def send_temporary_password_email(email, temporary_password , clinic_url='https://generic2.hitheal.org.il'):
    url = f'{clinic_url}/users/first/entrance/'
    subject = "Your HIT-Heal Lab Login Code"
    message = f'Your temporary password is: {temporary_password} . Please visit {url} and change it after your first login.'
    from_email = 'admin@hitheal.org.il'  
    recipient_list = [email]
    userMessage = sentMessages(
        userid = email,
        destinatary = email,
        msg_type = 'EMAIL',
        sender = from_email,
        sent_date = timezone.now(),
        status = 'SUCCESS',
        registered = False,
    )
    userMessage.save()
    msg = {'to_email':email,'from_email':"admin@hitheal.org.il",'subject':subject,'message':message , 'CHARSET':'UTF-8'}
    response = sendEmailMessage(msg)   
    print(subject, message, from_email, recipient_list , userMessage)
    return response

def get_clinic_id_for_user(user):
    if user.role == 'DOCTOR':
        doctor = Doctor.objects.get(user=user)
        clinic_id = DoctorClinic.objects.filter(doctor=doctor).values_list('clinic_id', flat=True)
    elif user.role == 'PATIENT' or user.role == 'RESEARCH_PATIENT':
        patient = Patient.objects.get(user=user)
        clinic_id = PatientClinic.objects.filter(patient=patient).values_list('clinic_id', flat=True)
    elif user.role == 'CLINIC_MANAGER':
        clinic_manager = ClinicManager.objects.get(user=user)
        clinic_id = ManagerClinic.objects.filter(manager=clinic_manager).values_list('clinic_id', flat=True)
    else: # admin
        clinic_id = [0]
    return clinic_id

def format_timestamp(timestamp):
    """
    Parse a timestamp (str or datetime) and return a timezone-aware datetime object.
    """
    if timestamp:
        # If timestamp is a string, parse it to datetime first
        if isinstance(timestamp, str):
            try:
                # Parse common timestamp formats
                if 'T' in timestamp:
                    # ISO format: "2025-07-15T12:00:00"
                    timestamp = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                else:
                    # Space-separated format: "2025-07-15 12:00:00"
                    timestamp = datetime.strptime(timestamp, '%Y-%m-%d %H:%M:%S')
                    # Make timezone-aware
                    timestamp = timezone.make_aware(timestamp)
            except ValueError as e:
                print(f"Error parsing timestamp: {e}")
                return None  # Return None if parsing fails

        # Ensure datetime is timezone-aware
        if timestamp and timezone.is_naive(timestamp):
            timestamp = timezone.make_aware(timestamp)
            
        # Return the timezone-aware datetime object
        return timestamp
    return None

def create_clinic_manager(email, first_name, last_name, phone_number , clinic):
    """
    Create a ClinicManager instance and return it.
    """
    if User.objects.filter(phone_number=phone_number).exists():
        return JsonResponse({
            "error": "user with this phone number already exists",
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not User.objects.filter(email=email).exists():
        temp_password = generate_temporary_password()
        user = User.objects.create_user(
            email=email,
            username=email,  # Use email as username
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
            password=temp_password,
            role='CLINIC_MANAGER',
    )
    else:
        user = User.objects.get(email=email)
        if user.role == 'CLINIC_MANAGER':
            return JsonResponse({
                "error": "Clinic manager with this email already exists",
            }, status=status.HTTP_400_BAD_REQUEST)
        if user.role == 'DOCTOR' and PatientDoctor.objects.filter(doctor__user=user).exists():
            return JsonResponse({
                "error": "Cannot create clinic manager, user is already a doctor with patients assigned"
            }, status=status.HTTP_400_BAD_REQUEST)
        user.role = 'CLINIC_MANAGER'
        user.save()
        
    
    clinic_manager = ClinicManager.objects.create(user=user)
    manager_clinic = ManagerClinic.objects.create(manager=clinic_manager, clinic=clinic)


    response = send_temporary_password_email(email, temp_password)
    if response.status_code != 200:
        return JsonResponse({
            "error": "Failed to send email",
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return JsonResponse({
        "message": "Clinic manager created successfully",
    } , status=status.HTTP_201_CREATED)
    
    
def setup_totp(user):
    try:
        device = TOTPDevice.objects.get(user=user)
    except TOTPDevice.DoesNotExist:
        device = TOTPDevice.objects.create(user=user)
    
    issuer = "Generic2"
    label = f"{issuer}:{user.email}"  # Label shown in the app
    otp_uri2 = device.config_url
    if otp_uri2 is None:
        otp_uri2 = device.config_url(user=user, issuer=issuer, label=label)
    otp_uri2 = otp_uri2.replace(quote(user.email),quote(label))
    print(f"otp_uri2: {otp_uri2}")
    
    # Build the otpauth URI manually
    img = qrcode.make(otp_uri2)
    buffer = BytesIO()
    img.save(buffer)
    
    return HttpResponse(buffer.getvalue(), content_type="image/png")