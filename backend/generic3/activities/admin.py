from django.contrib import admin
from .models import Activity, ActivityReport, ClinicActivity, PatientActivity

admin.site.register(Activity)
admin.site.register(ClinicActivity)
admin.site.register(PatientActivity)
admin.site.register(ActivityReport)
