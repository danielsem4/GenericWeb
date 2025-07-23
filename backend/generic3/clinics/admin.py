from django.contrib import admin
from .models import Clinic, Modules, ClinicModules, DoctorClinic, PatientClinic, ManagerClinic


admin.site.register(Clinic)
admin.site.register(Modules)
admin.site.register(ClinicModules)
admin.site.register(DoctorClinic)
admin.site.register(PatientClinic)
admin.site.register(ManagerClinic)
