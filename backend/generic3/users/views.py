from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes , permission_classes
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from generic3.utils import generate_temporary_password, get_user_role, send_temporary_password_email, setup_totp
from users.models import Doctor, Patient, PatientDoctor, User, ClinicManager
from clinics.models import Clinic , DoctorClinic, PatientClinic


#### Get users for a specific clinic depending on the user type
@api_view(['GET'])
# @authentication_classes([TokenAuthentication])
def get_users(request, clinic_id, user_id):
    """
    Get users for a specific clinic.
    """
    users = None
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    if user.is_staff:
        clinic_managers = ClinicManager.objects.all().values_list('user__id', flat=True)
        users = User.objects.filter(id__in=clinic_managers)
    else:
        # If the user is not a staff member, filter users based on their role in the clinic
        try:
            clinic = Clinic.objects.get(id=clinic_id)
        except Clinic.DoesNotExist:
            return Response({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if user.is_clinic_manager:
            clinicdoctors = DoctorClinic.objects.filter(clinic_id=clinic_id).values_list('doctor', flat=True)
            users = User.objects.filter(id__in=clinicdoctors)
        if user.is_doctor:
            clinicpatients = PatientClinic.objects.filter(clinic_id=clinic_id).values_list('patient', flat=True)
            users = User.objects.filter(id__in=clinicpatients)

    user_details = {}
    if not users:
        return Response({"detail": "No users found for this clinic or this role"}, status=status.HTTP_404_NOT_FOUND)
    for user in users:
        user_details[user.id] = {
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone_number': user.phone_number,
            'is_clinic_manager': user.is_clinic_manager,
            'is_doctor': user.is_doctor,
            'is_patient': user.is_patient,
            'is_research_patient': user.is_research_patient
        }
    if not user_details:
        return Response({"detail": "No users found for this clinic"}, status=status.HTTP_404_NOT_FOUND)

    return Response(user_details, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_user_details(request, user_id):
    """
    Get details of a specific user.
    """
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    user_details = {
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'phone_number': user.phone_number,
        'role': get_user_role(user),
    }

    return Response(user_details, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_user_qr_code(request, user_id):
    """
    Get QR code image for TOTP setup
    """
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    return setup_totp(user)

@api_view(['POST'])
def add_user(request, clinic_id, user_id):
    """
    Add a user to a specific clinic.
    """
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check if the clinic exists
    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return Response({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)

    email = request.data.get('email')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    phone_number = request.data.get('phone_number', '')
    is_doctor = False
    is_patient = False
    is_research_patient = False

    existing_user = User.objects.all().values_list('email','phone_number', flat=True)
    if email in existing_user or phone_number in existing_user:
        return Response({"detail": "User with this email or phone number already exists"}, status=status.HTTP_400_BAD_REQUEST)
    
    if clinic.is_research_clinic and user.is_doctor:
        is_research_patient = True
        password = request.data.get('password', None)
        confirm_password = request.data.get('confirm_password', None)
        if password != confirm_password:
            return Response({"detail": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)
        passw = make_password(password)
    else:
        passw = generate_temporary_password()
        status = send_temporary_password_email(email,passw,clinic.clinic_url)
        if status == 1:
            return Response({"detail": "Error sending email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if user.is_clinic_manager:
        is_doctor = True
    elif user.is_doctor and not clinic.is_research_clinic:
        is_patient = True

    # Create the user
    new_user = User.objects.create(
        email=email,
        first_name=first_name,
        last_name=last_name,
        phone_number=phone_number,
        password=passw,
        is_doctor=is_doctor,
        is_patient=is_patient,
        is_research_patient=is_research_patient,
        is_clinic_manager=False,  # Default to False
        is_staff=False,  # Default to False
    )

    # Add the user to the clinic
    if new_user.is_doctor:
        doctor = Doctor.objects.create(user=new_user)
        DoctorClinic.objects.create(doctor=doctor, clinic=clinic)
    elif new_user.is_patient:
        patient = Patient.objects.create(user=new_user)
        doctor = Doctor.objects.get(user=user)
        if doctor:
            PatientDoctor.objects.create(patient=patient, doctor=doctor, clinic=clinic)        
        PatientClinic.objects.create(patient=patient, clinic=clinic)
    else:
        return Response({"detail": "User role is not supported"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"detail": "User added to clinic successfully"}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
def update_user(request, user_id):
    """
    Update a user 
    """
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    email = request.data.get('email', user.email)
    first_name = request.data.get('first_name', user.first_name)
    last_name = request.data.get('last_name', user.last_name)
    phone_number = request.data.get('phone_number', user.phone_number)

    # Update user details
    user.email = email
    user.first_name = first_name
    user.last_name = last_name
    user.phone_number = phone_number

    # Save the updated user
    user.save()

    return Response({"detail": "User updated successfully"}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def remove_user(request, clinic_id, user_id):
    """
    Remove a user from a specific clinic.
    """
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check if the clinic exists
    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return Response({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)

    if user.is_doctor:
        doctor = Doctor.objects.get(user=user)
        if PatientDoctor.objects.filter(doctor=doctor, clinic=clinic).exists():
            return Response({"detail": "Cannot remove doctor with assigned patients"}, status=status.HTTP_400_BAD_REQUEST)
        DoctorClinic.objects.filter(doctor=doctor, clinic=clinic).delete()
    elif user.is_patient or user.is_research_patient:
        patient = Patient.objects.get(user=user)
        PatientClinic.objects.filter(patient=patient, clinic=clinic).delete()
        PatientDoctor.objects.filter(patient=patient).delete()
    else:
        return Response({"detail": "User role cannot be removed"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"detail": "User removed from clinic successfully"}, status=status.HTTP_204_NO_CONTENT)