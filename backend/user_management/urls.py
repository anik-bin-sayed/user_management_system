from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("allauth.urls")),
    path("api/accounts/", include("accounts.urls")),
    path("api/profile/", include("userprofile.urls")),
]
