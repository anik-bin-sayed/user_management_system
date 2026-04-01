import random

from django.conf import settings
from django.core.mail import send_mail

from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


# otp
def generate_otp():
    return str(random.randint(100000, 999999))


# token
def issue_tokens(user):

    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token)

    response = Response(
        {
            "detail": "Login successful",
            "access_token": access,
        }
    )

    response.set_cookie(
        "access_token",
        access,
        httponly=True,
        secure=not settings.DEBUG,
        samesite="Lax",
        max_age=60 * 15,
    )

    response.set_cookie(
        "refresh_token",
        str(refresh),
        httponly=True,
        secure=not settings.DEBUG,
        samesite="Lax",
        max_age=60 * 60 * 24 * 30,
    )

    return response


# send email
def send_email(subject, message, recipient_list):
    """
    Send email with proper recipient list handling.
    recipient_list can be a string or a list
    """
    # Ensure recipient_list is always a list for send_mail
    if isinstance(recipient_list, str):
        recipient_list = [recipient_list]
    elif not isinstance(recipient_list, list):
        recipient_list = [str(recipient_list)]
    
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=recipient_list,
        fail_silently=False,
    )
