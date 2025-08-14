from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view , authentication_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework import status
from generic3.auth import CookieJWTAuthentication
from clinics.models import Clinic
from users.models import PatientDoctor, User, Patient
from medications.models import MedicationReport, Medicines, PatientMedicine , ClinicMedicine
from generic3.utils import format_timestamp

########### admin medication management ##############################################

@api_view(['GET'])
def get_all_medications(request):
    """
    Get all medications.
    """
    if not request.user.is_authenticated or not request.user.is_staff:
        return JsonResponse({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
    
    medications = Medicines.objects.all()
    medications_data = []
    for med in medications:
        medications_data.append({
            'id': med.id,
            'medForm': med.medForm,
            'medName': med.medName,
            'medUnitOfMeasurement': med.medUnitOfMeasurement
        })
    return JsonResponse(medications_data, safe=False, status=status.HTTP_200_OK)

@api_view(['POST'])
def add_medication(request):
    """
    Add a new medication.
    """
    if not request.user.is_authenticated or not request.user.is_staff:
        return JsonResponse({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
    
    data = request.data
    med_id = data.get('id')
    if Medicines.objects.filter(id=med_id).exists():
        return JsonResponse({"detail": "Medication with this ID already exists"}, status=status.HTTP_400_BAD_REQUEST)
    med_form = data.get('medForm')
    med_name = data.get('medName')
    if Medicines.objects.filter(medName=med_name).exists():
        return JsonResponse({"detail": "Medication with this name already exists"}, status=status.HTTP_400_BAD_REQUEST)
    med_unit_of_measurement = data.get('medUnitOfMeasurement')

    if not med_id or not med_form or not med_name or not med_unit_of_measurement:
        return JsonResponse({"detail": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

    Medicines.objects.create(
        id=med_id,
        medForm=med_form,
        medName=med_name,
        medUnitOfMeasurement=med_unit_of_measurement
    )

    return JsonResponse({"detail": "Medication added successfully"}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
def update_medication(request, medication_id):
    """
    Update an existing medication.
    """
    if not request.user.is_authenticated or not request.user.is_staff:
        return JsonResponse({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        medication = Medicines.objects.get(id=medication_id)
    except Medicines.DoesNotExist:
        return JsonResponse({"detail": "Medication not found"}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    med_form = data.get('medForm')
    med_name = data.get('medName')
    med_unit_of_measurement = data.get('medUnitOfMeasurement')

    if not med_form or not med_name or not med_unit_of_measurement:
        return JsonResponse({"detail": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

    medication.medForm = med_form
    medication.medName = med_name
    medication.medUnitOfMeasurement = med_unit_of_measurement
    medication.save()

    return JsonResponse({"detail": "Medication updated successfully"}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_medication(request, medication_id):
    """
    Delete a medication.
    """
    if not request.user.is_authenticated or not request.user.is_staff:
        return JsonResponse({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        medication = Medicines.objects.get(id=medication_id)
    except Medicines.DoesNotExist:
        return JsonResponse({"detail": "Medication not found"}, status=status.HTTP_404_NOT_FOUND)

    medication.delete()
    return JsonResponse({"detail": "Medication deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

########## clinic medications management ##############################################

@api_view(['GET'])
def get_clinic_medications(request, clinic_id):
    """
    Get medications for a specific clinic.
    """
    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return JsonResponse({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)

    clinic_medications = ClinicMedicine.objects.filter(clinic=clinic).select_related('medicine')
    
    if not clinic_medications:
        return JsonResponse({"detail": "No medications found for this clinic"}, status=status.HTTP_404_NOT_FOUND)

    medications_data = []
    for cm in clinic_medications:
        medication = cm.medicine
        medications_data.append({
            'id': medication.id,
            'medForm': medication.medForm,
            'medName': medication.medName,
            'medUnitOfMeasurement': medication.medUnitOfMeasurement
        })

    return JsonResponse(medications_data, safe=False, status=status.HTTP_200_OK)

@api_view(['POST'])
def add_clinic_medication(request, clinic_id):
    """
    Add a medication to a specific clinic.
    """
    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return JsonResponse({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    med_id = data.get('med_id')

    if not med_id:
        return JsonResponse({"detail": "Missing medication ID"}, status=status.HTTP_400_BAD_REQUEST)

    medication = Medicines.objects.get(id=med_id)
    if not medication:
        return JsonResponse({"detail": "Medication not found"}, status=status.HTTP_404_NOT_FOUND)

    ClinicMedicine.objects.get_or_create(clinic=clinic, medicine=medication)

    return JsonResponse({"detail": "Medication added successfully"}, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
def delete_clinic_medication(request, clinic_id, medication_id):
    """
    Delete a medication from a specific clinic.
    """
    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return JsonResponse({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        medication = Medicines.objects.get(id=medication_id)
    except Medicines.DoesNotExist:
        return JsonResponse({"detail": "Medication not found"}, status=status.HTTP_404_NOT_FOUND)

    if not ClinicMedicine.objects.filter(clinic=clinic, medicine=medication).exists():
        return JsonResponse({"detail": "Medication not found in this clinic"}, status=status.HTTP_404_NOT_FOUND)
    ClinicMedicine.objects.filter(clinic=clinic, medicine=medication).delete()

    return JsonResponse({"detail": "Medication deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

############ patient medications management ###########################################

@api_view(['GET'])
@authentication_classes([CookieJWTAuthentication ])
def get_patient_medications(request, clinic_id, patient_id):
    """
    Get all medications for a specific patient in a clinic.
    """
    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return JsonResponse({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        user = User.objects.get(id=patient_id)
        if user.role not in ['PATIENT', 'RESEARCH_PATIENT']:
            return JsonResponse({"detail": "User is not a patient"}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return JsonResponse({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        patient = Patient.objects.get(user=user)
    except Patient.DoesNotExist:
        return JsonResponse({"detail": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

    patient_medications = PatientMedicine.objects.filter(patient=patient, clinic=clinic)

    if not patient_medications:
        return JsonResponse({"detail": "No medications found for this patient in this clinic"}, status=status.HTTP_404_NOT_FOUND)

    medications_data = []
    for pm in patient_medications:
        medication = pm.medicine
        medications_data.append({
            'id': medication.id,
            'medForm': medication.medForm,
            'medName': medication.medName,
            'medUnitOfMeasurement': medication.medUnitOfMeasurement,
            'doctor': pm.doctor.user.email if pm.doctor else None,
            'frequency': pm.frequency,
            'frequency_data': pm.frequency_data,
            'start_date': pm.start_date.isoformat() if pm.start_date else None,
            'end_date': pm.end_date.isoformat() if pm.end_date else None,
            'dosage': pm.dosage if pm.dosage else None
        })

    return JsonResponse(medications_data, safe=False, status=status.HTTP_200_OK)

@api_view(['POST'])
def add_patient_medication(request, clinic_id, patient_id):
    """
    Add a medication for a specific patient in a clinic.
    """
    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return JsonResponse({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        user = User.objects.get(id=patient_id)
        if user.role not in ['PATIENT', 'RESEARCH_PATIENT']:
            return JsonResponse({"detail": "User is not a patient"}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return JsonResponse({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        patient = Patient.objects.get(user=user)
    except Patient.DoesNotExist:
        return JsonResponse({"detail": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    med_id = data.get('med_id')
    frequency = data.get('frequency')
    frequency_data = data.get('frequency_data')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    dosage = data.get('dosage')

    if not med_id or not frequency or not frequency_data:
        return JsonResponse({"detail": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

    medication = Medicines.objects.get(id=med_id)
    if not medication:
        return JsonResponse({"detail": "Medication not found"}, status=status.HTTP_404_NOT_FOUND)

    if not ClinicMedicine.objects.filter(clinic=clinic, medicine=medication).exists():
        return JsonResponse({"detail": "Medication not available in this clinic"}, status=status.HTTP_404_NOT_FOUND)
    
    if PatientMedicine.objects.filter(patient=patient, clinic=clinic, medicine=medication).exists():
        return JsonResponse({"detail": "Medication already assigned to this patient in this clinic"}, status=status.HTTP_400_BAD_REQUEST)

    patient_doctor = PatientDoctor.objects.filter(patient=patient, clinic=clinic).first()
    if not patient_doctor:
        return JsonResponse({"detail": "Patient is not assigned to a doctor in this clinic"}, status=status.HTTP_403_FORBIDDEN)
    
    PatientMedicine.objects.create(
        patient=patient,
        clinic=clinic,
        doctor=patient_doctor.doctor,
        medicine=medication,
        frequency=frequency,
        frequency_data=frequency_data,
        start_date=start_date,
        end_date=end_date,
        dosage=dosage
    )

    return JsonResponse({"detail": "Medication added successfully"}, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
def update_patient_medication(request, clinic_id, patient_id):
    """
    Update a medication for a specific patient in a clinic.
    """
    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return JsonResponse({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        user = User.objects.get(id=patient_id)
        if user.role not in ['PATIENT', 'RESEARCH_PATIENT']:
            return JsonResponse({"detail": "User is not a patient"}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return JsonResponse({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        patient = Patient.objects.get(user=user)
    except Patient.DoesNotExist:
        return JsonResponse({"detail": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    med_id = data.get('med_id')
    frequency = data.get('frequency')
    frequency_data = data.get('frequency_data')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    dosage = data.get('dosage')

    if not med_id or not frequency or not frequency_data:
        return JsonResponse({"detail": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

    medication = Medicines.objects.get(id=med_id)
    if not medication:
        return JsonResponse({"detail": "Medication not found"}, status=status.HTTP_404_NOT_FOUND)

    if not ClinicMedicine.objects.filter(clinic=clinic, medicine=medication).exists():
        return JsonResponse({"detail": "Medication not available in this clinic"}, status=status.HTTP_404_NOT_FOUND)

    patient_medication = PatientMedicine.objects.filter(patient=patient, clinic=clinic, medicine=medication).first()
    
    if not patient_medication:
        return JsonResponse({"detail": "Medication not assigned to this patient in this clinic"}, status=status.HTTP_404_NOT_FOUND)

    patient_medication.frequency = frequency
    patient_medication.frequency_data = frequency_data
    patient_medication.start_date = start_date
    patient_medication.end_date = end_date
    patient_medication.dosage = dosage
    patient_medication.save()

    return JsonResponse({"detail": "Medication updated successfully"}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_patient_medication(request, clinic_id, patient_id , medication_id):
    """
    Delete a medication for a specific patient in a clinic.
    """
    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return JsonResponse({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        user = User.objects.get(id=patient_id)
        if user.role not in ['PATIENT', 'RESEARCH_PATIENT']:
            return JsonResponse({"detail": "User is not a patient"}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return JsonResponse({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        patient = Patient.objects.get(user=user)
    except Patient.DoesNotExist:
        return JsonResponse({"detail": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

    if not medication_id:
        return JsonResponse({"detail": "Missing medication ID"}, status=status.HTTP_400_BAD_REQUEST)

    medication = Medicines.objects.get(id=medication_id)
    if not medication:
        return JsonResponse({"detail": "Medication not found"}, status=status.HTTP_404_NOT_FOUND)

    patient_medication = PatientMedicine.objects.filter(patient=patient, clinic=clinic, medicine=medication).first()
    
    if not patient_medication:
        return JsonResponse({"detail": "Medication not assigned to this patient in this clinic"}, status=status.HTTP_404_NOT_FOUND)

    patient_medication.delete()

    return JsonResponse({"detail": "Medication deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def get_patient_medications_log(request, clinic_id, patient_id):
    """
    Get medication log for a specific patient in a clinic.
    """
    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return JsonResponse({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        user = User.objects.get(id=patient_id)
        if user.role not in ['PATIENT', 'RESEARCH_PATIENT']:
            return JsonResponse({"detail": "User is not a patient"}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return JsonResponse({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        patient = Patient.objects.get(user=user)
    except Patient.DoesNotExist:
        return JsonResponse({"detail": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

    medication_log = MedicationReport.objects.filter(patient=patient, clinic=clinic).order_by('-timestamp')

    if not medication_log:
        return JsonResponse({"detail": "No medication log found for this patient in this clinic"}, status=status.HTTP_404_NOT_FOUND)

    log_data = []
    for log in medication_log:
        log_data.append({
            'medication_id': log.medication.id,
            'medication_name': log.medication.medName,
            'medication_form': log.medication.medForm,
            'medication_unit_of_measurement': log.medication.medUnitOfMeasurement,
            'timestamp': log.timestamp
        })

    return JsonResponse(log_data, safe=False, status=status.HTTP_200_OK)
############ patient side  ###########################################

@api_view(['POST'])
def patient_medication_report(request):
    """
    Generate a medication report for a patient.
    """
    clinic_id = request.data.get('clinic_id')
    patient_id = request.data.get('patient_id')
    medication_id = request.data.get('medication_id')
    timestamp = request.data.get('timestamp' , None)
    if not clinic_id or not patient_id or not medication_id:
        return JsonResponse({"detail": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        clinic = Clinic.objects.get(id=clinic_id)
    except Clinic.DoesNotExist:
        return JsonResponse({"detail": "Clinic not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        user = User.objects.get(id=patient_id)
        if user.role not in ['PATIENT', 'RESEARCH_PATIENT']:
            return JsonResponse({"detail": "User is not a patient"}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return JsonResponse({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        patient = Patient.objects.get(user=user)
    except Patient.DoesNotExist:
        return JsonResponse({"detail": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        medication = Medicines.objects.get(id=medication_id)
    except Medicines.DoesNotExist:
        return JsonResponse({"detail": "Medication not found"}, status=status.HTTP_404_NOT_FOUND)
    try:
        timestamp = format_timestamp(timestamp)
    except ValueError:
        return JsonResponse({"detail": "Invalid timestamp format"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not PatientMedicine.objects.filter(patient=patient, clinic=clinic, medicine=medication).exists():
        return JsonResponse({"detail": "Medication not assigned to this patient in this clinic"}, status=status.HTTP_404_NOT_FOUND)
    
    MedicationReport.objects.create(
        clinic=clinic,
        patient=patient,
        medication=medication,
        timestamp=timestamp
    )
    
    # notification logic will be implemented here in the future

    return JsonResponse({"detail": "Medication report generated successfully"}, status=status.HTTP_201_CREATED)

