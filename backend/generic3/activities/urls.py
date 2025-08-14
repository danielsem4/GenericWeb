from django.urls import path
from . import views

urlpatterns = [
    # admin activity management
    path('api/v1/activities/', views.get_all_activities, name='get_all_activities'),
    path('api/v1/activities/add/', views.add_activity, name='add_activity'),
    path('api/v1/activities/update/<int:activity_id>/', views.update_activity, name='update_activity'),
    path('api/v1/activities/delete/<int:activity_id>/', views.delete_activity, name='delete_activity'),

    # clinic activity management
    path('api/v1/activities/clinic/<int:clinic_id>/', views.get_clinic_activities, name='get_clinic_activities'),
    path('api/v1/activities/clinic/<int:clinic_id>/add/', views.add_clinic_activity, name='add_clinic_activity'),
    path('api/v1/activities/clinic/<int:clinic_id>/delete/<int:activity_id>/', views.delete_clinic_activity, name='delete_clinic_activity'),
    
    # patient activity management
    path('api/v1/activities/patient/<int:clinic_id>/<int:patient_id>/', views.get_patient_activities, name='get_patient_activities'),
    path('api/v1/activities/patient/<int:clinic_id>/<int:patient_id>/add/', views.add_patient_activity, name='add_patient_activity'),
    path('api/v1/activities/patient/<int:clinic_id>/<int:patient_id>/delete/<int:activity_id>/', views.delete_patient_activity, name='delete_patient_activity'),
    path('api/v1/activities/patient/<int:clinic_id>/<int:patient_id>/log/', views.get_patient_activities_log, name='get_patient_activities_log'),

    # patient side
    path('api/v1/activities/report/', views.patient_activity_report, name='patient_activity_report'),
]