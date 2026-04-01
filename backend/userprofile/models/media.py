from django.db import models

from cloudinary.models import CloudinaryField

from accounts.models import User


class UserProfilePhoto(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="images")
    image = CloudinaryField("image")
    is_current = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.id}"
