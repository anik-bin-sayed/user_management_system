from rest_framework import serializers

from accounts.models import User

from ..models.user_profile import *
from ..models.professional import ProfessionalInfo
from ..models.media import UserProfilePhoto

from .professional import ProfessionalInfoSerializer


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "full_name",
            "is_verified",
            "is_locked",
            "two_factor_enabled",
        ]


class UnifiedProfileSerializer(serializers.ModelSerializer):

    # Personal Info
    id = serializers.IntegerField(source="user.id", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    username = serializers.CharField(
        source="user.username", allow_blank=True, required=False
    )
    full_name = serializers.CharField(
        source="user.full_name", allow_blank=True, required=False
    )
    birthdate = serializers.DateField(allow_null=True, required=False)
    gender = serializers.CharField(allow_blank=True, required=False)
    marital_status = serializers.CharField(allow_blank=True, required=False)
    bio = serializers.CharField(allow_blank=True, required=False)
    language = serializers.CharField(allow_blank=True, required=False)
    city = serializers.CharField(allow_blank=True, required=False)
    country = serializers.CharField(allow_blank=True, required=False)
    zip_code = serializers.CharField(allow_blank=True, required=False)

    # Contact Info
    alternate_email = serializers.EmailField(allow_blank=True, required=False)
    phone = serializers.CharField(allow_blank=True, required=False)
    phone_verified = serializers.BooleanField(required=False)
    address = serializers.CharField(allow_blank=True, required=False)
    timezone = serializers.CharField(allow_blank=True, required=False)

    # Social Links
    website = serializers.URLField(allow_blank=True, required=False)
    linkedin = serializers.URLField(allow_blank=True, required=False)
    github = serializers.URLField(allow_blank=True, required=False)
    twitter = serializers.URLField(allow_blank=True, required=False)
    portfolio_url = serializers.URLField(allow_blank=True, required=False)
    social_links = serializers.JSONField(required=False)

    # Preferences
    language_preference = serializers.CharField(allow_blank=True, required=False)
    dark_mode_enabled = serializers.BooleanField(required=False)
    notification_preferences = serializers.JSONField(required=False)

    # Account
    is_verified = serializers.BooleanField(source="user.is_verified", read_only=True)
    is_locked = serializers.BooleanField(source="user.is_locked", read_only=True)
    two_factor_enabled = serializers.BooleanField(
        source="user.two_factor_enabled", read_only=True
    )
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    professional_info = ProfessionalInfoSerializer(
        source="user.professional_info", required=False, allow_null=True
    )

    class Meta:
        model = UserProfile

        fields = "__all__"

    def to_internal_value(self, data):
        """Handle nested structures from frontend and unwrap them"""
        # Unwrap contact_info if it comes as nested object
        if "contact_info" in data and isinstance(data["contact_info"], dict):
            contact_data = data.pop("contact_info")
            data.update(contact_data)

        # Unwrap social_links if it comes as nested object
        if "social_links" in data and isinstance(data["social_links"], dict):
            social_data = data.pop("social_links")
            data.update(social_data)

        # Unwrap personal_info if it comes as nested object
        if "personal_info" in data and isinstance(data["personal_info"], dict):
            personal_data = data.pop("personal_info")
            data.update(personal_data)

        # Unwrap preferences if it comes as nested object
        if "preferences" in data and isinstance(data["preferences"], dict):
            pref_data = data.pop("preferences")
            data.update(pref_data)

        return super().to_internal_value(data)

    def update(self, instance, validated_data):
        user = instance.user

        new_image = validated_data.pop("image", None)

        user_data = validated_data.pop("user", {})

        # Handle professional_info
        professional_info_data = validated_data.pop("user", {}).pop(
            "professional_info", None
        )
        if professional_info_data is None:
            professional_info_data = validated_data.pop("professional_info", None)

        # Extract nested user fields from validated_data
        if "full_name" in validated_data:
            user_data["full_name"] = validated_data.pop("full_name")
        if "username" in validated_data:
            user_data["username"] = validated_data.pop("username")

        # Save user data
        if user_data:
            for attr, value in user_data.items():
                setattr(user, attr, value)
        user.save()

        if new_image:
            UserProfilePhoto.objects.filter(user=user, is_current=True).update(
                is_current=False
            )

            UserProfilePhoto.objects.create(user=user, image=new_image, is_current=True)

        # Handle professional_info update/create
        if professional_info_data is not None:
            try:
                professional = user.professional_info
                serializer = ProfessionalInfoSerializer(
                    professional, data=professional_info_data, partial=True
                )
            except ProfessionalInfo.DoesNotExist:
                serializer = ProfessionalInfoSerializer(data=professional_info_data)
                professional = None

            if serializer.is_valid():
                if professional is None:
                    # Create new ProfessionalInfo with user association
                    professional = serializer.save(user=user)
                else:
                    serializer.save()
            else:
                raise serializers.ValidationError(serializer.errors)

        # update userprofile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def to_representation(self, instance):

        professional_info = None
        try:
            professional = instance.user.professional_info
            professional_info = ProfessionalInfoSerializer(professional).data
        except ProfessionalInfo.DoesNotExist:
            professional_info = None

        return {
            "personal_info": {
                "id": instance.user.id,
                "email": instance.user.email,
                "full_name": instance.user.full_name,
                "username": instance.user.username,
                "birthdate": instance.birthdate,
                "gender": instance.gender,
                "marital_status": instance.marital_status,
                "bio": instance.bio,
                "language": instance.language,
                "city": instance.city,
                "country": instance.country,
                "zip_code": instance.zip_code,
            },
            "contact_info": {
                "email": instance.user.email,
                "alternate_email": instance.alternate_email,
                "phone": instance.phone,
                "phone_verified": instance.phone_verified,
                "address": instance.address,
                "zip_code": instance.zip_code,
                "timezone": instance.timezone,
            },
            "social_links": {
                "website": instance.website,
                "linkedin": instance.linkedin,
                "github": instance.github,
                "twitter": instance.twitter,
                "portfolio_url": instance.portfolio_url,
                "social_links": instance.social_links,
            },
            "professional_info": professional_info,
            "preferences": {
                "language_preference": instance.language_preference,
                "dark_mode_enabled": instance.dark_mode_enabled,
                "notification_preferences": instance.notification_preferences,
            },
            "account_info": {
                "is_verified": instance.user.is_verified,
                "is_locked": instance.user.is_locked,
                "two_factor_enabled": instance.user.two_factor_enabled,
                "created_at": instance.created_at,
                "updated_at": instance.updated_at,
            },
        }
