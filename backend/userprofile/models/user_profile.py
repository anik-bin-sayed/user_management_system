from django.db import models

from accounts.models import User


# Create your models here.


class UserProfile(models.Model):
    # Basic Info
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    birthdate = models.DateField(blank=True, null=True)
    gender = models.CharField(
        max_length=10,
        choices=[("Male", "Male"), ("Female", "Female"), ("Other", "Other")],
        blank=True,
    )
    marital_status = models.CharField(max_length=20, blank=True)
    language = models.CharField(max_length=50, blank=True)
    timezone = models.CharField(max_length=50, blank=True)

    # Contact Info
    alternate_email = models.EmailField(blank=True)
    phone_verified = models.BooleanField(default=False)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)

    # Social Links
    linkedin = models.URLField(blank=True)
    github = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    social_links = models.JSONField(default=dict, blank=True)

    # Preferences / Settings
    language_preference = models.CharField(max_length=20, blank=True)
    dark_mode_enabled = models.BooleanField(default=False)
    notification_preferences = models.JSONField(default=dict, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username
