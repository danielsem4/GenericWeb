from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes , permission_classes
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from modules.models import ClinicModules, PatientModules
from generic3.utils import generate_temporary_password, send_temporary_password_email, setup_totp
from users.models import Doctor, Patient, PatientDoctor, User, ClinicManager
from clinics.models import Clinic , DoctorClinic, PatientClinic


#### Get users for a specific clinic depending on the user type
@api_view(['GET'])
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

        if user.role == 'CLINIC_MANAGER':
            clinicdoctors = DoctorClinic.objects.filter(clinic_id=clinic_id).values_list('doctor', flat=True)
            users = User.objects.filter(id__in=clinicdoctors)
        if user.role == 'DOCTOR':
            clinicpatients = PatientClinic.objects.filter(clinic_id=clinic_id).values_list('patient', flat=True)
            users = User.objects.filter(id__in=clinicpatients)

    user_details = []
    if not users:
        return Response({"detail": "No users found for this clinic or this role"}, status=status.HTTP_404_NOT_FOUND)
    for user in users:
        user_details.append({
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone_number': user.phone_number,
            'role': user.role,
        })
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
        'role': user.role,
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
def add_user(request, clinic_id):
    """
    Add a user to a specific clinic.
    """
    user = request.user
    # Check if the clinic exists
    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return Response({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)

    email = request.data.get('email')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    phone_number = request.data.get('phone_number', '')
    
    # Check if user already exists
    existing_user = None
    try:
        existing_user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Check by phone number if email doesn't exist
        if phone_number:
            try:
                existing_user = User.objects.get(phone_number=phone_number)
            except User.DoesNotExist:
                pass
    
    if existing_user:
        # User exists, validate the data matches
        if (existing_user.first_name != first_name or 
            existing_user.last_name != last_name or 
            existing_user.phone_number != phone_number or
            existing_user.email != email):
            return Response({"detail": "User exists but provided data doesn't match existing user"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Data matches, use existing user and skip to clinic assignment
        new_user = existing_user
    else:
        # User doesn't exist, create new user
        if clinic.is_research_clinic and user.role == 'DOCTOR':
            role = 'RESEARCH_PATIENT'
            password = request.data.get('password', None)
            confirm_password = request.data.get('confirm_password', None)
            if password != confirm_password:
                return Response({"detail": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)
            passw = make_password(password)
        else:
            passw = generate_temporary_password()
            response = send_temporary_password_email(email, passw, clinic.clinic_url)
            if response.status != 200:
                return response

        if user.role == 'CLINIC_MANAGER':
            role = 'DOCTOR'
        elif user.role == 'DOCTOR' and not clinic.is_research_clinic:
            role = 'PATIENT'

        # Create the user
        new_user = User.objects.create(
            email=email,
            username=email,  # Use email as username
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
            password=passw,
            role=role,
        )

    # Add the user to the clinic 
    if new_user.role == 'DOCTOR':
        doctor, created = Doctor.objects.get_or_create(user=new_user)
        DoctorClinic.objects.get_or_create(doctor=doctor, clinic=clinic)
    elif new_user.role == 'PATIENT' or new_user.role == 'RESEARCH_PATIENT':
        patient, created = Patient.objects.get_or_create(user=new_user)
        doctor = Doctor.objects.get(user=user)
        if doctor:
            PatientDoctor.objects.get_or_create(patient=patient, doctor=doctor, clinic=clinic)        
        PatientClinic.objects.get_or_create(patient=patient, clinic=clinic)
        clinic_modules = ClinicModules.objects.filter(clinic=clinic)
        for module in clinic_modules:
            PatientModules.objects.get_or_create(patient=patient, clinic=clinic, module=module)
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

    if user.role == 'DOCTOR':
        doctor = Doctor.objects.get(user=user)
        if PatientDoctor.objects.filter(doctor=doctor, clinic=clinic).exists():
            return Response({"detail": "Cannot remove doctor with assigned patients"}, status=status.HTTP_400_BAD_REQUEST)
        DoctorClinic.objects.filter(doctor=doctor, clinic=clinic).delete()
    elif user.role == 'PATIENT' or user.role == 'RESEARCH_PATIENT':
        patient = Patient.objects.get(user=user)
        PatientClinic.objects.filter(patient=patient, clinic=clinic).delete()
        PatientDoctor.objects.filter(patient=patient).delete()
    else:
        return Response({"detail": "User role cannot be removed"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"detail": "User removed from clinic successfully"}, status=status.HTTP_204_NO_CONTENT)