from django.urls import path
from . import views

urlpatterns = [
    
    # clinic medication management
    path('api/v1/medications/clinic/<int:clinic_id>/', views.get_clinic_medications, name='get_clinic_medications'),
    path('api/v1/medications/clinic/<int:clinic_id>/add/', views.add_clinic_medication, name='add_clinic_medication'),
    path('api/v1/medications/clinic/<int:clinic_id>/delete/<int:medication_id>/', views.delete_clinic_medication, name='delete_clinic_medication'),
    
    # patient medication management
    path('api/v1/medications/patient/<int:clinic_id>/<int:patient_id>/', views.get_patient_medications, name='get_patient_medications'),
    path('api/v1/medications/patient/<int:clinic_id>/<int:patient_id>/add/', views.add_patient_medication, name='add_patient_medication'),
    path('api/v1/medications/patient/<int:clinic_id>/<int:patient_id>/update/', views.update_patient_medication, name='update_patient_medication'),
    path('api/v1/medications/patient/<int:clinic_id>/<int:patient_id>/delete/<int:medication_id>/', views.delete_patient_medication, name='delete_patient_medication'),
    
    # patient side 
    path('api/v1/medications/report/', views.patient_medication_report, name='patient_medication_report'),
]

