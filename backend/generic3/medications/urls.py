from django.urls import path
from . import views

urlpatterns = [
    # admin medication management
    path('api/v1/medications/', views.get_all_medications, name='get_all_medications'),
    path('api/v1/medications/add/', views.add_medication, name='add_medication'),
    path('api/v1/medications/update/<int:medication_id>/', views.update_medication, name='update_medication'),
    path('api/v1/medications/delete/<int:medication_id>/', views.delete_medication, name='delete_medication'),
    
    # clinic medication management
    path('api/v1/medications/clinic/<int:clinic_id>/', views.get_clinic_medications, name='get_clinic_medications'),
    path('api/v1/medications/clinic/<int:clinic_id>/add/', views.add_clinic_medication, name='add_clinic_medication'),
    path('api/v1/medications/clinic/<int:clinic_id>/delete/<int:medication_id>/', views.delete_clinic_medication, name='delete_clinic_medication'),
    
    # patient medication management
    path('api/v1/medications/patient/<int:clinic_id>/<int:patient_id>/', views.get_patient_medications, name='get_patient_medications'),
    path('api/v1/medications/patient/<int:clinic_id>/<int:patient_id>/add/', views.add_patient_medication, name='add_patient_medication'),
    path('api/v1/medications/patient/<int:clinic_id>/<int:patient_id>/update/', views.update_patient_medication, name='update_patient_medication'),
    path('api/v1/medications/patient/<int:clinic_id>/<int:patient_id>/delete/<int:medication_id>/', views.delete_patient_medication, name='delete_patient_medication'),
    path('api/v1/medications/patient/<int:clinic_id>/<int:patient_id>/log/', views.get_patient_medications_log, name='get_patient_medications_log'),

    # patient side
    path('api/v1/medications/report/', views.patient_medication_report, name='patient_medication_report'),
]

