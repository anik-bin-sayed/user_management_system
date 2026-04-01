# Utils imports
import pyotp


# Rest import
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

# django import
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import authenticate

# Local import
from .models import *
from .utils import send_email


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "username", "full_name", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data["password"]

        from django.contrib.auth.hashers import make_password

        token_obj = EmailVerificationToken.objects.create(
            email=validated_data["email"],
            username=validated_data["username"],
            full_name=validated_data.get("full_name", ""),
            password_hash=make_password(password),
        )

        verification_link = f"{settings.FRONTEND_URL}/verify-email/{token_obj.token}/"

        send_email(
            subject="Verify your email",
            message=f"Click the link to verify your account: {verification_link}",
            recipient_list=token_obj.email,
        )

        return token_obj


class LoginTokenSerializer(TokenObtainPairSerializer):
    otp = serializers.CharField(write_only=True, required=False)

    def validate(self, attrs):

        # email + password verify
        data = super().validate(attrs)

        user = self.user

        if user.two_factor_enabled:
            otp_value = attrs.get("otp")

            if not otp_value:
                raise serializers.ValidationError({"otp": "OTP is required."})

            totp = pyotp.TOTP(user.two_factor_secret or "")

            if not totp.verify(otp_value, valid_window=1):
                raise serializers.ValidationError({"otp": "Invalid OTP"})

        data["user"] = {
            "id": user.id,
            "email": user.email,
            "username": user.username,
        }

        return data


class RefreshAccessSerializer(serializers.Serializer):
    refresh = serializers.CharField(write_only=True)

    def validate(self, attrs):
        token = attrs.get("refresh")
        try:
            refresh = RefreshToken(token)
            access = str(refresh.access_token)
            return {"access": access}
        except TokenError:
            raise serializers.ValidationError(
                {"refresh": "Token is invalid or expired."}
            )


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

    def validate_new_password(self, value):
        user = self.context["request"].user
        from django.contrib.auth.password_validation import validate_password

        # run Django's validators (length, common, numeric, etc.)
        validate_password(value, user)
        return value

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user
