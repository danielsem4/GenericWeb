from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes , permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from users.models import User, ClinicManager
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

