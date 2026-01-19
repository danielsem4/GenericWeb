from django.urls import path
from authentication import views

urlpatterns = [
    #### Shared auth endpoints
    path('api/v1/auth/user/', views.authenticate_user, name='authenticate_user'),
    path('api/v1/auth/2fa/verify/', views.verify_2fa_code, name='verify_2fa_code'),
    path('api/v1/auth/password/change/', views.password_change, name='password_change'),
    path('api/v1/auth/login/', views.login, name='login'),
    path('api/v1/auth/refresh/', views.refresh_token, name='refresh_token'),
    path('api/v1/auth/logout/', views.logout, name='logout'),
    
]
