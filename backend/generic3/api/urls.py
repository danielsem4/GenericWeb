from django.urls import path
from . import views

urlpatterns = [
    #### Shared API endpoints
    # path('api/v1/auth/first/login/', views.first_login, name='first_login'),
    # path('api/v1/auth/password/change/', views.password_change, name='password_change'),
    path('api/v1/auth/login/', views.login, name='login'),
    path('api/v1/auth/refresh/', views.refresh_token, name='refresh_token'),
    path('api/v1/auth/logout/', views.logout, name='logout'),
]
