from django.shortcuts import redirect
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken


def google_login_complete(request):
    user = request.user
    if not user.is_authenticated:
        return redirect(f"{settings.FRONTEND_URL}/login?error=auth_failed")

    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token)

    response = redirect(settings.FRONTEND_URL)

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

    response.set_cookie(
        "__auth",
        "true",
        httponly=False,
        secure=not settings.DEBUG,
        samesite="Lax" if settings.DEBUG else "None",
        max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds(),
    )

    return response
