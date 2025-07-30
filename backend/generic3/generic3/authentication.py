from rest_framework.authentication import BaseAuthentication
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AnonymousUser
from rest_framework import exceptions

class CookieTokenAuthentication(BaseAuthentication):
    """
    Custom authentication class that gets token from cookies
    """
    def authenticate(self, request):
        # First try to get token from cookie
        token_key = request.COOKIES.get('auth_token')
        
        # If no cookie, try Authorization header as fallback
        if not token_key:
            auth_header = request.META.get('HTTP_AUTHORIZATION')
            if auth_header and auth_header.startswith('Token '):
                token_key = auth_header.split(' ')[1]
        
        if not token_key:
            return None
        
        try:
            token = Token.objects.get(key=token_key)
            return (token.user, token)
        except Token.DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid token')