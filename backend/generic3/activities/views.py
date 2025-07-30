from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework import status
from django.utils import timezone
from django.http import JsonResponse
from generic3.utils import format_timestamp
from users.models import PatientDoctor, User, Patient
from .models import Activity, ActivityReport, ClinicActivity, PatientActivity
from clinics.models import Clinic

############ clinic activities management ############

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def get_clinic_activities(request, clinic_id):
    """
    Get all activities for a specific clinic.
    """
    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return JsonResponse({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        activities = ClinicActivity.objects.filter(clinic=clinic).select_related('activity')
    except ClinicActivity.DoesNotExist:
        return JsonResponse({"detail": "No activities found for this clinic"}, status=status.HTTP_404_NOT_FOUND)
   
    activity_list = [{"id": activity.activity.id, "name": activity.activity.name, "description": activity.activity.description} for activity in activities]
    return JsonResponse(activity_list, safe=False, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def add_clinic_activity(request, clinic_id):
    """
    Add a new activity to a specific clinic.
    """
    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return JsonResponse({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    activity_id = data.get('activity_id')

    if not activity_id:
        return JsonResponse({"detail": "Activity ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        activity = Activity.objects.get(id=activity_id)
    except Activity.DoesNotExist:
        return JsonResponse({"detail": "Activity not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Create the clinic activity
    ClinicActivity.objects.get_or_create(activity=activity, clinic=clinic)

    return JsonResponse({"detail": "Activity added successfully"}, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
def delete_clinic_activity(request, clinic_id, activity_id):
    """
    Delete a specific activity from a clinic.
    """
    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return JsonResponse({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        activity = Activity.objects.get(id=activity_id)
    except Activity.DoesNotExist:
        return JsonResponse({"detail": "Activity not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        clinic_activity = ClinicActivity.objects.get(activity=activity, clinic=clinic)
        clinic_activity.delete()
        return JsonResponse({"detail": "Activity deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
    except ClinicActivity.DoesNotExist:
        return JsonResponse({"detail": "Activity not found in this clinic"}, status=status.HTTP_404_NOT_FOUND)

############ patient activities management ############

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def get_patient_activities(request, clinic_id, patient_id):
    """
    Get all activities for a specific patient in a clinic.
    """
    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return JsonResponse({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        user = User.objects.get(id=patient_id)
        if not user.is_patient and not user.is_research_patient:
            return JsonResponse({"detail": "User is not a patient"}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return JsonResponse({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        patient = Patient.objects.get(user=user)
    except Patient.DoesNotExist:
        return JsonResponse({"detail": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        patient_activities = PatientActivity.objects.filter(clinic=clinic, patient=patient).select_related('activity', 'doctor')
    except PatientActivity.DoesNotExist:
        return JsonResponse({"detail": "No activities found for this patient"}, status=status.HTTP_404_NOT_FOUND)

    activity_list = [
        {
            "id": activity.activity.id,
            "name": activity.activity.name,
            "description": activity.activity.description,
            "doctor": activity.doctor.user.id,
            "timestamp": activity.timestamp.isoformat()
        } for activity in patient_activities
    ]

    return JsonResponse(activity_list, safe=False, status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def add_patient_activity(request, clinic_id, patient_id):
    """
    Add a new activity for a specific patient in a clinic.
    """
    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return JsonResponse({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        user = User.objects.get(id=patient_id)
        if not user.is_patient and not user.is_research_patient:
            return JsonResponse({"detail": "User is not a patient"}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return JsonResponse({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        patient = Patient.objects.get(user=user)
    except Patient.DoesNotExist:
        return JsonResponse({"detail": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        activities = PatientActivity.objects.filter(clinic=clinic, patient=patient).select_related('activity', 'doctor')
    except PatientActivity.DoesNotExist:
        return JsonResponse({"detail": "No activities found for this patient"}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    activity_id = data.get('activity_id')

    if not activity_id:
        return JsonResponse({"detail": "Missing activity ID"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        activity = Activity.objects.get(id=activity_id)
    except Activity.DoesNotExist:
        return JsonResponse({"detail": "Activity not found"}, status=status.HTTP_404_NOT_FOUND)

    if not ClinicActivity.objects.filter(clinic=clinic, activity=activity).exists():
        return JsonResponse({"detail": "Activity not found in this clinic"}, status=status.HTTP_404_NOT_FOUND)

    if PatientActivity.objects.filter(clinic=clinic, patient=patient, activity=activity).exists():
        return JsonResponse({"detail": "Activity already exists for this patient in this clinic"}, status=status.HTTP_400_BAD_REQUEST)
    
    patient_doctor = PatientDoctor.objects.filter(patient=patient, clinic=clinic).first()
    if not patient_doctor:
        return JsonResponse({"detail": "Patient is not assigned to a doctor in this clinic"}, status=status.HTTP_403_FORBIDDEN)
    
    PatientActivity.objects.create(
        activity=activity,
        patient=patient,
        doctor=patient_doctor.doctor,
        clinic=clinic,
        timestamp=timezone.now()
    )
    return JsonResponse({"detail": "Activity added successfully"}, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
def delete_patient_activity(request, clinic_id, patient_id, activity_id):
    """
    Delete a specific activity for a patient in a clinic.
    """
    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return JsonResponse({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        user = User.objects.get(id=patient_id)
        if not user.is_patient and not user.is_research_patient:
            return JsonResponse({"detail": "User is not a patient"}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return JsonResponse({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        patient = Patient.objects.get(user=user)
    except Patient.DoesNotExist:
        return JsonResponse({"detail": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

    if not activity_id:
        return JsonResponse({"detail": "Activity ID is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        activity = Activity.objects.get(id=activity_id)
    except Activity.DoesNotExist:
        return JsonResponse({"detail": "Activity not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        patient_activity = PatientActivity.objects.get(clinic=clinic, patient=patient, activity=activity)
        patient_activity.delete()
        return JsonResponse({"detail": "Activity deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
    except PatientActivity.DoesNotExist:
        return JsonResponse({"detail": "Activity not found for this patient in this clinic"}, status=status.HTTP_404_NOT_FOUND)
    
############ patient side  ###########################################

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def patient_activity_report(request):
    """
    Generate an activity report for a patient.
    """
    clinic_id = request.data.get('clinic_id')
    patient_id = request.data.get('patient_id')
    activity_id = request.data.get('activity_id')
    timestamp = request.data.get('timestamp' , None)
    
    if not clinic_id or not patient_id or not activity_id:
        return JsonResponse({"detail": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return JsonResponse({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        user = User.objects.get(id=patient_id)
        if not user.is_patient and not user.is_research_patient:
            return JsonResponse({"detail": "User is not a patient"}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return JsonResponse({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        patient = Patient.objects.get(user=user)
    except Patient.DoesNotExist:    
        return JsonResponse({"detail": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        activity = Activity.objects.get(id=activity_id)
    except Activity.DoesNotExist:
        return JsonResponse({"detail": "Activity not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        timestamp = format_timestamp(timestamp)
    except ValueError:
        return JsonResponse({"detail": "Invalid timestamp format"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not PatientActivity.objects.filter(clinic=clinic, patient=patient, activity=activity).exists():
        return JsonResponse({"detail": "Activity not found for this patient in this clinic"}, status=status.HTTP_404_NOT_FOUND)
    
    ActivityReport.objects.create(
        clinic=clinic,
        patient=patient,
        activity=activity,
        timestamp=timestamp
    )
    
    # notification logic will be implemented here in the future
    
    return JsonResponse({"detail": "Activity report generated successfully"}, status=status.HTTP_201_CREATED)


# @api_view(['POST'])
# @authentication_classes([TokenAuthentication])
# def patient_activity_notification(request):
#     """
#     Set notification settings for the authenticated patient's activities.
#     """
#     patient = request.user.patient
#     # Implement notification settings logic here
#     return JsonResponse({"detail": "Notification settings updated successfully"}, status=status.HTTP_200_OK)

