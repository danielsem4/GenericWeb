from django.db import models

from clinics.models import Clinic
from users.models import Doctor, Patient

class Activity(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    
    def __str__(self):
        return self.name
    
class ClinicActivity(models.Model):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    clinic = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.activity.name}"
    
class PatientActivity(models.Model):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.activity.name} for Patient {self.patient.user.first_name} {self.patient.user.last_name}"

class ActivityReport(models.Model):
    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    