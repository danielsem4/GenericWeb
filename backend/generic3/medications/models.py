from django.utils import timezone
from django.db import models
from users.models import Doctor, Patient
from clinics.models import Clinic

class Medicines(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    medForm = models.CharField(max_length=255)
    medName = models.CharField(max_length=255)
    medUnitOfMeasurement = models.CharField(max_length=255)

class ClinicMedicine(models.Model):
    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE , related_name='clinic_id')
    medicine = models.ForeignKey(Medicines, on_delete= models.CASCADE)

medicinesRepeatPeriods = (
    ('once','once'),
    ('daily','daily'),
    ('weekly','weekly'),
    ('monthly','monthly'),
)

class PatientMedicine(models.Model):
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
    )
    medicine = models.ForeignKey(
        Medicines,
        on_delete=models.CASCADE,
    )

    clinic = models.ForeignKey(
        Clinic,
        on_delete=models.CASCADE,
        null=True, blank=True,         
    )
    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        null=True, blank=True,
    )

    frequency       = models.CharField(max_length=30,
                                       choices=medicinesRepeatPeriods,
                                       null=True, blank=True)
    frequency_data  = models.JSONField(default=list, null=True, blank=True)
    start_date      = models.DateTimeField(default=timezone.now,
                                           null=True, blank=True)
    end_date        = models.DateTimeField(null=True, blank=True)
    dosage          = models.CharField(max_length=255, null=True, blank=True)


