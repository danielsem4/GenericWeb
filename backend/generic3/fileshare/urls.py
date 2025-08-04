from django.urls import path
from . import views

urlpatterns = [
    # file share endpoints
    path('api/v1/fileshare/files/<int:clinic_id>/<int:patient_id>/', views.get_shared_files, name='get_shared_files'),
    path('api/v1/fileshare/files/<int:clinic_id>/<int:patient_id>/add/', views.add_shared_files, name='add_shared_files'),
    path('api/v1/fileshare/files/<int:clinic_id>/<int:patient_id>/delete/<int:file_id>/', views.delete_shared_files, name='delete_shared_files'),
]
