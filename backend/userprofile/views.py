import cloudinary.uploader

from rest_framework import status
from rest_framework import generics
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from .utils import *
from .serializers.media import *
from .serializers.user_profile import *


# Create your views here.


class UserProfileViews(generics.RetrieveUpdateAPIView):
    serializer_class = UnifiedProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile


# upload image
class UploadProfileImage(APIView):
    permissions_classes = [permissions.IsAuthenticated]

    def post(self, request):
        image = request.FILES.get("image")

        if not image:
            return Response(
                {"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST
            )
        UserProfilePhoto.objects.filter(user=request.user, is_current=True).update(
            is_current=False
        )

        photo = UserProfilePhoto.objects.create(
            user=request.user, image=image, is_current=True
        )

        return Response(
            {
                "message": "Profile image uploaded successfully",
                "image": photo.image.url,
            },
            status=status.HTTP_201_CREATED,
        )


# current photo
class CurrentProfilePhoto(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        photo = UserProfilePhoto.objects.filter(is_current=True).first()

        return Response({"image": photo.image.url if photo else None})


# Gallery
class UserProfilePhotosView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        photos = UserProfilePhoto.objects.filter(user=request.user).order_by(
            "-uploaded_at"
        )

        paginator = CustomPagination()
        paginated_photos = paginator.paginate_queryset(photos, request)

        data = [
            {
                "id": photo.id,
                "image": photo.image.url,
                "uploaded_at": photo.uploaded_at,
            }
            for photo in paginated_photos
        ]

        return paginator.get_paginated_response(data)


class MakeAsProfileApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, id):

        photo = get_object_or_404(UserProfilePhoto, id=id, user=request.user)

        UserProfilePhoto.objects.filter(user=request.user).update(is_current=False)

        photo.is_current = True
        photo.save()

        return Response({"message": "Make profile successfully"})


class DeletePhotoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, id):
        try:
            photo = UserProfilePhoto.objects.get(id=id, user=request.user)

            if photo.image:
                cloudinary.uploader.destroy(photo.image.public_id)

            photo.delete()

            return Response({"message": "Deleted"}, status=status.HTTP_200_OK)

        except UserProfilePhoto.DoesNotExist:
            return Response(
                {"error": "Photo not found"}, status=status.HTTP_404_NOT_FOUND
            )
