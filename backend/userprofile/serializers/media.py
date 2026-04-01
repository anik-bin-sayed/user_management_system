from rest_framework import serializers

from ..models.media import UserProfilePhoto


class UserProfilePhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfilePhoto
        fields = ["id", "image", "uploaded_at", "user"]
        read_only_fields = ["uploaded_at", "is_current"]
