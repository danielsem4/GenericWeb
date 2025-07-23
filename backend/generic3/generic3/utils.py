from users.models import Doctor , ClinicManager, Patient
from clinics.models import DoctorClinic, ManagerClinic, PatientClinic


def get_clinic_id_for_user(user):
    if user.is_doctor:
        print("Doctor")
        doctor = Doctor.objects.get(user=user)
        clinic_id = DoctorClinic.objects.filter(doctor=doctor).values_list('clinic_id', flat=True)
    elif user.is_patient or user.is_research_patient:
        patient = Patient.objects.get(user=user)
        clinic_id = PatientClinic.objects.filter(patient=patient).values_list('clinic_id', flat=True)
    elif user.is_clinic_manager:
        clinic_manager = ClinicManager.objects.get(user=user)
        clinic_id = ManagerClinic.objects.filter(manager=clinic_manager).values_list('clinic_id', flat=True)
    else: # admin
        clinic_id = [0]
    return clinic_id