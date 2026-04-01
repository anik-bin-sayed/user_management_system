from django.urls import path

from .views import *

urlpatterns = [
    # profile related
    path("", UserProfileViews.as_view(), name="profile"),
    path("upload-photo/", UploadProfileImage.as_view(), name="upload-photo"),
    path("current-photo/", CurrentProfilePhoto.as_view(), name="profile"),
    path("gallery/", UserProfilePhotosView.as_view(), name="gallery"),
    path("delete/<int:id>", DeletePhotoView.as_view(), name="delete"),
    path(
        "make-profile-photo/<int:id>",
        MakeAsProfileApiView.as_view(),
        name="make-profile-photo",
    ),
]
