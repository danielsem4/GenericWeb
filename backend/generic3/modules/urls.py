from django.urls import path
from . import views

urlpatterns = [
    # admin modules management
    path('api/v1/modules/add/', views.add_module, name='add_module'),
    path('api/v1/modules/<int:module_id>/update/', views.update_module, name='update_module'),
    path('api/v1/modules/<int:module_id>/delete/', views.delete_module, name='delete_module'),
    
    # clinic modules management
    path('api/v1/clinics/<int:clinic_id>/modules/<int:module_id>/add/', views.add_clinic_module, name='add_clinic_module'),
    path('api/v1/clinics/<int:clinic_id>/modules/<int:module_id>/delete/', views.delete_clinic_module, name='delete_clinic_module'),

    # patient modules management
    path('api/v1/clinics/<int:clinic_id>/patients/<int:patient_id>/modules/<int:module_id>/add/', views.add_patient_module, name='add_patient_module'),
    path('api/v1/clinics/<int:clinic_id>/patients/<int:patient_id>/modules/<int:module_id>/delete/', views.delete_patient_module, name='delete_patient_module'),

    path('api/v1/clinics/<int:clinic_id>/modules/<int:module_id>/toggle/', views.toggle_clinic_module_active, name='toggle_clinic_module_active'),
    path('api/v1/clinics/<int:clinic_id>/patients/<int:patient_id>/modules/<int:module_id>/toggle/', views.toggle_patient_module_active, name='toggle_patient_module_active'),

]