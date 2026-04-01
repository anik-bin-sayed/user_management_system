from django.urls import path, include

from .OAuthView import google_login_complete

from .views import *

urlpatterns = [
    # auth related
    path("register/", RegisterView.as_view(), name="register"),
    path("verify-email/<uuid:token>/", VerifyEmailView.as_view(), name="verify-email"),
    # login
    path("login/", CookieTokenObtainPairView.as_view(), name="login"),
    path("two-factor/verify-login/", VerifyLoginView.as_view(), name="verify-login"),
    # refresh token
    path("refresh/", RefreshAccessTokenView.as_view(), name="token_refresh"),
    # logout
    path("logout/", LogoutView.as_view(), name="logout"),
    # two factor
    path("two-factor/setup/", SetupTwoFactorView.as_view(), name="setup-two-factor"),
    path("two-factor/verify/", VerifyTwoFactorView.as_view(), name="verify-two-factor"),
    path(
        "two-factor/disable/", DisableTwoFactorView.as_view(), name="disable-two-factor"
    ),
    # Reset password
    path("password-reset/", PasswordResetRequestView.as_view(), name="password-reset"),
    path(
        "password-reset-verify/<str:uidb64>/<str:token>/",
        VerifyResetTokenView.as_view(),
        name="password-reset-verify",
    ),
    path(
        "password-reset-confirm/<str:uidb64>/<str:token>/",
        SetNewPasswordView.as_view(),
        name="password-reset-confirm",
    ),
    # change password
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    # Social related
    path("social/", include("social_django.urls", namespace="social")),
    # delete account
    path("delete/", DeleteAccountSerializer.as_view(), name="delete_account"),
    # oauth
    path("google/complete/", google_login_complete, name="google_login_complete"),
]
