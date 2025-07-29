from django.urls import path
from . import views

urlpatterns = [
    path('api/v1/users/<int:clinic_id>/<int:user_id>/', views.get_users, name='get_users'),
]
