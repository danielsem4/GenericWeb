from django.urls import path
from . import views

urlpatterns = [
    # API endpoints
    path('api/v1/login/', views.login, name='api_login'),
]
