from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

from userprofile.models.user_profile import UserProfile
from userprofile.models.professional import *

User = get_user_model()


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
        professions = ProfessionalInfo.objects.create(user=instance)
        Skill.objects.create(professional=professions)
        EducationalInfo.objects.create(professional=professions)
        Project.objects.create(professional=professions)
