from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    is_clinic_manager = models.BooleanField(default=False)
    is_doctor = models.BooleanField(default=False)
    is_patient = models.BooleanField(default=False)
    is_research_patient = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
    

class ClinicManager(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return f"{self.user}"
    
class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return f"{self.user}"
    
class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return f"{self.user}"
    
class PatientDoctor(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    clinic = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.patient} - {self.doctor}"
    
    
class sentMessages(models.Model):
    MessageType = (
       ('EMAIL','email'),
       ('SMS','SMS/Text Message'),
    )
    SentStatus = (
       ('SUCCESS','message sent'),
       ('FAIL','message not sent'),
    )
    userid = models.CharField(('user id'),max_length=255)
    msg_type = models.CharField(('message type'), choices=MessageType,max_length=10, blank=True)
    sender = models.CharField(('sender string'),max_length=255)
    destinatary = models.CharField(('destinatary string'),max_length=255)
    sent_date = models.DateTimeField(default=timezone.now , blank=True)
    status = models.CharField(('message status'), choices=SentStatus,max_length=10, blank=True , default='FAIL')
    registered = models.BooleanField('registered', default=False , blank=True)
