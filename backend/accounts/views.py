# imports utils
import pyotp

# Rest imports
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status, generics, permissions
from rest_framework.throttling import ScopedRateThrottle


# django imports
from django.conf import settings
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.core.mail import send_mail
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

token_generator = PasswordResetTokenGenerator()

# Local imports
from .models import *
from .utils import *
from .serializers import *


User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer


from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import ScopedRateThrottle
from rest_framework_simplejwt.views import TokenObtainPairView


class CookieTokenObtainPairView(TokenObtainPairView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "login"
    serializer_class = LoginTokenSerializer

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"detail": "Email and password required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, email=email, password=password)

        if user is None:
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if hasattr(user, "two_factor_enabled") and user.two_factor_enabled:
            return Response(
                {
                    "two_factor_enabled": True,
                    "detail": "Enter OTP",
                    "email": user.email,
                    "user_id": user.id,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "two_factor_enabled": False,
                "detail": "Login successful",
                "email": user.email,
                "user_id": user.id,
            },
            status=status.HTTP_200_OK,
        )


class VerifyLoginView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        try:
            user = User.objects.get(id=request.data["user_id"])
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid user"}, status=status.HTTP_400_BAD_REQUEST
            )
        except KeyError:
            return Response(
                {"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        code = str(request.data.get("code", "")).strip()

        if not code:
            return Response(
                {"error": "Code is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        totp = pyotp.TOTP(user.two_factor_secret)

        if totp.verify(code, valid_window=1000):
            return issue_tokens(user)
        return Response({"error": "Invalid code"}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        user = None
        if getattr(request, "user", None) and request.user.is_authenticated:
            user = request.user
        else:
            raw = request.COOKIES.get("refresh_token")
            if raw:
                try:
                    refresh_obj = RefreshToken(raw)
                    uid = refresh_obj.get("user_id")
                    if uid:
                        user = User.objects.filter(id=uid).first()
                except Exception:
                    pass

        if not user:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh_token = request.COOKIES.get("refresh_token")
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass

        response = Response(
            {"detail": "Logged out successfully"}, status=status.HTTP_200_OK
        )
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Password changed successfully"}, status=status.HTTP_200_OK
        )


class VerifyEmailView(APIView):
    def get(self, request, token):
        try:
            token_obj = EmailVerificationToken.objects.get(token=token, is_used=False)
        except EmailVerificationToken.DoesNotExist:
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if token_obj.expires_at < timezone.now():
            return Response(
                {"error": "Token expired"}, status=status.HTTP_400_BAD_REQUEST
            )

        if not token_obj.user:
            user, created = User.objects.get_or_create(
                email=token_obj.email,
                defaults={
                    "username": token_obj.username,
                    "full_name": token_obj.full_name,
                    "is_verified": True,
                    "is_active": True,
                },
            )
            if created:
                user.password = token_obj.password_hash
                try:
                    user.save()
                except IntegrityError:
                    return Response(
                        {
                            "error": "Unable to create account, username or email may be taken"
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            token_obj.user = user
        else:
            user = token_obj.user
            user.is_verified = True
            user.is_active = True
            try:
                user.save()
            except IntegrityError:
                return Response(
                    {"error": "Unable to verify account"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Mark token as used
        token_obj.is_used = True
        try:
            token_obj.save()
        except IntegrityError:
            return Response(
                {"error": "Unable to mark token as used"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"message": "Email verified successfully"}, status=status.HTTP_200_OK
        )


class RefreshAccessTokenView(APIView):
    permission_classes = []

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token missing"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = RefreshAccessSerializer(data={"refresh": refresh_token})
        serializer.is_valid(raise_exception=True)

        access_token = serializer.validated_data["access"]

        response = Response(
            {"message": "Access token refreshed", "access_token": access_token},
            status=status.HTTP_200_OK,
        )

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=not settings.DEBUG,
            samesite="Lax",
            max_age=60 * 15,
        )

        return response


class SetupTwoFactorView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        user = request.user
        password = request.data.get("password")

        if not password:
            return Response(
                {"error": "Password is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(password):
            return Response(
                {"error": "Incorrect password"}, status=status.HTTP_400_BAD_REQUEST
            )

        if user.two_factor_enabled:
            return Response(
                {"error": "2FA already enabled"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Generate new secret
        secret = pyotp.random_base32()
        user.two_factor_secret = secret
        user.save(update_fields=["two_factor_secret"])

        totp = pyotp.TOTP(secret)

        otp_auth_url = totp.provisioning_uri(
            name=user.email, issuer_name="user_management"
        )

        return Response(
            {"secret": secret, "otp_auth_url": otp_auth_url}, status=status.HTTP_200_OK
        )


class VerifyTwoFactorView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        code = str(request.data.get("code", "")).strip()
        user = request.user
        secret = user.two_factor_secret

        if not code:
            return Response(
                {"error": "Code is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Ensure code is numeric and 6 digits
        if not code.isdigit() or len(code) != 6:
            return Response(
                {"error": "Code must be 6 digits"}, status=status.HTTP_400_BAD_REQUEST
            )

        if not secret:
            return Response(
                {"error": "2FA setup not initiated"}, status=status.HTTP_400_BAD_REQUEST
            )

        if user.two_factor_enabled:
            return Response(
                {"error": "2FA already enabled"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            totp = pyotp.TOTP(secret)

            if totp.verify(code, valid_window=1000):
                user.two_factor_enabled = True
                user.save(update_fields=["two_factor_enabled"])

                return Response(
                    {"message": "Two factor enabled"}, status=status.HTTP_200_OK
                )
            else:
                pass

        except Exception as e:
            pass
            return Response(
                {"error": "Verification failed"}, status=status.HTTP_400_BAD_REQUEST
            )

        return Response({"error": "Invalid code"}, status=status.HTTP_400_BAD_REQUEST)


class DisableTwoFactorView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "disable-two-factor"
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        password = request.data.get("password")

        if not password:
            return Response(
                {"error": "Password is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        if not request.user.check_password(password):
            return Response(
                {"error": "Incorrect password"}, status=status.HTTP_400_BAD_REQUEST
            )

        request.user.two_factor_enabled = False
        request.user.two_factor_secret = None
        request.user.save()

        return Response({"message": "2FA disabled"}, status=status.HTTP_200_OK)


class DeleteAccountSerializer(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        password = request.data.get("password")
        user = request.user
        if not password:
            return Response(
                {"error": "Password is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(password):
            return Response(
                {"error": "Wrong password"}, status=status.HTTP_400_BAD_REQUEST
            )

        user.delete()
        self.response.delete_cookie("access_token")
        self.response.delete_cookie("refresh_token")

        response = Response(
            {"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT
        )

        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response


import ast


class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"error": "Email is required"}, status=400)

        if isinstance(email, str):
            try:
                email = ast.literal_eval(email)
            except:
                email = [email]

        if isinstance(email, list):
            email = email
        else:
            email = [email]

        try:
            user = User.objects.get(email=email[0])
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        token = PasswordResetTokenGenerator().make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.id))

        reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"

        send_email(
            subject="Reset your password",
            message=f"Click this link to verify: {reset_link}",
            recipient_list=email[0],
        )

        return Response({"message": "Verification link sent to email"})


class VerifyResetTokenView(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=uid)
        except Exception:
            return Response({"error": "Invalid link"}, status=400)

        if PasswordResetTokenGenerator().check_token(user, token):
            return Response({"success": "Token valid"})
        else:
            return Response({"error": "Token invalid or expired"}, status=400)


class SetNewPasswordView(APIView):
    def post(self, request, uidb64, token):
        password = request.data.get("password")

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=uid)
        except Exception:
            return Response({"error": "Invalid link"}, status=400)

        if not PasswordResetTokenGenerator().check_token(user, token):
            return Response({"error": "Token invalid or expired"}, status=400)

        user.set_password(password)
        user.save()

        return Response({"success": "Password reset successful"})
