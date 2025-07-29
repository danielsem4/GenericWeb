from django.urls import path
from . import views

urlpatterns = [
    #### Shared API endpoints
    path('api/v1/login/', views.login, name='login'),
]
