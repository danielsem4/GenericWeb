from django.urls import path
from . import views

urlpatterns = [
    path('api/v1/users/<int:clinic_id>/<int:user_id>/', views.get_users, name='get_users'),
    path('api/v1/users/<int:user_id>/', views.get_user_details, name='get_user_details'),
    path('api/v1/users/<int:user_id>/qr-code/', views.get_user_qr_code, name='get_user_qr_code'),
    path('api/v1/users/<int:clinic_id>/<int:user_id>/add/', views.add_user, name='add_user'),
    path('api/v1/users/<int:user_id>/update/', views.update_user, name='update_user'),
    path('api/v1/users/<int:clinic_id>/<int:user_id>/remove/', views.remove_user, name='remove_user')
]
