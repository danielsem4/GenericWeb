from django.urls import path
from . import views

urlpatterns = [
    path('api/v1/clinics/', views.get_all_clinics, name='get_all_clinics'),
    path('api/v1/clinics/<int:clinic_id>/', views.get_clinic_details, name='get_clinic_details'),
    path('api/v1/clinics/add/', views.add_clinic, name='add_clinic'),
    path('api/v1/clinics/<int:clinic_id>/update/', views.update_clinic, name='update_clinic'),
    
]
