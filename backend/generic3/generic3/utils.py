from datetime import datetime
from django.utils import timezone
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