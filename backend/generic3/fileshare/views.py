import boto3
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import status
from django.utils import timezone
from rest_framework.decorators import api_view
from clinics.models import Clinic
from users.models import Doctor, Patient, User
from .models import SharedFiles

######################## general file share endpoints ########################

@api_view(['GET'])
def get_shared_files(request , clinic_id, patient_id):
    """
    Retrieve shared files for a specific clinic and patient.
    """
    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return JsonResponse({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        user = User.objects.get(id=patient_id)
        if user.role != 'PATIENT' and user.role != 'RESEARCH_PATIENT':
            return JsonResponse({"detail": "User is not a patient"}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return JsonResponse({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        patient = Patient.objects.get(user=user)
    except Patient.DoesNotExist:
        return JsonResponse({"detail": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

    files = SharedFiles.objects.filter(clinic_id=clinic_id, patient_id=patient_id)
    data = []
    for file in files:
        data.append({
            "file_name": file.file_name,
            "file_path": file.file_path,
            "size": file.size,
            "upload_date": file.upload_date.isoformat(),
            "doctor": file.doctor.user.first_name + " " + file.doctor.user.last_name if file.doctor else None
        })
    return JsonResponse({f"files for {patient.user.first_name} {patient.user.last_name} in {clinic.clinic_name}": data}, status=status.HTTP_200_OK)

## NOT FINISHED YET
@api_view(['POST'])
def add_shared_files(request, clinic_id, patient_id):
    """
    Add shared files for a specific clinic and patient.
    """
    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return JsonResponse({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        user = User.objects.get(id=patient_id)
        if user.role != 'PATIENT' and user.role != 'RESEARCH_PATIENT':
            return JsonResponse({"detail": "User is not a patient"}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return JsonResponse({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        patient = Patient.objects.get(user=user)
    except Patient.DoesNotExist:
        return JsonResponse({"detail": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

    doctor_id = request.data.get('doctor_id')
    user = User.objects.get(id=doctor_id)
    if user.role != 'DOCTOR':
        return JsonResponse({"detail": "User is not a doctor"}, status=status.HTTP_403_FORBIDDEN)
    try:
        doctor = Doctor.objects.get(user=user)
    except Doctor.DoesNotExist:
        return JsonResponse({"detail": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)

    # Handle file upload
    files = request.FILES.getlist('file')
    if not files:
        return JsonResponse({"detail": "No files uploaded"}, status=status.HTTP_400_BAD_REQUEST)
    
    s3 = boto3.client('s3',region_name='il-central-1')

    for file in files:
        path = f"generic3/clinic/{clinic_id}/patient/{patient_id}/fileshare/{file.name}"
        try:
            res = s3.put_object(Body=file, Bucket='generic2-bucket', Key=path)
            if res['ResponseMetadata']['HTTPStatusCode'] == 200:
                shared_file = SharedFiles.objects.create(
                    clinic=clinic,
                    patient=patient,
                    file_name=file.name,
                    file_path=path,
                    size=file.size,
                    upload_date=timezone.now(),
                    doctor=doctor
                )
            else:
                return JsonResponse({"detail": "Failed to upload file to S3"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # notification logic will be implemented here
            
        except Exception as e:
            return JsonResponse({"detail": f"Error uploading file: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return JsonResponse({"detail": "Files successfully uploaded"}, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
def delete_shared_files(request, clinic_id, patient_id, file_id):
    """
    Delete a shared file for a specific clinic and patient.
    """
    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return JsonResponse({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        user = User.objects.get(id=patient_id)
        if user.role != 'PATIENT' and user.role != 'RESEARCH_PATIENT':
            return JsonResponse({"detail": "User is not a patient"}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return JsonResponse({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        patient = Patient.objects.get(user=user)
    except Patient.DoesNotExist:
        return JsonResponse({"detail": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        shared_file = SharedFiles.objects.get(id=file_id, clinic=clinic, patient=patient)
        s3 = boto3.client('s3',region_name='il-central-1')
        s3.delete_object(Bucket='generic2-bucket', Key=shared_file.file_path)   
        shared_file.delete()
        return JsonResponse({"detail": "File deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except SharedFiles.DoesNotExist:
        return JsonResponse({"detail": "Shared file not found"}, status=status.HTTP_404_NOT_FOUND)