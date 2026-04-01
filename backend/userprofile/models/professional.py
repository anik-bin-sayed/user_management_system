from django.db import models

from accounts.models import User


class ProfessionalInfo(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="professional_info"
    )

    job_title = models.CharField(max_length=200, blank=True)
    company = models.CharField(max_length=250, blank=True)
    industry = models.CharField(max_length=150, blank=True)

    experience_years = models.PositiveIntegerField(default=0)

    employment_type = models.CharField(
        max_length=50,
        choices=[
            ("Full-time", "Full-time"),
            ("Part-time", "Part-time"),
            ("Contract", "Contract"),
            ("Freelance", "Freelance"),
            ("Internship", "Internship"),
        ],
        blank=True,
    )
    available_for_work = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email}"


class Skill(models.Model):
    professional = models.ForeignKey(
        ProfessionalInfo, on_delete=models.CASCADE, related_name="skills"
    )

    name = models.CharField(max_length=100)

    def __str__(self):
        return self.professional.user.email


class EducationalInfo(models.Model):
    professional = models.ForeignKey(
        ProfessionalInfo, on_delete=models.CASCADE, related_name="educations"
    )

    degree = models.CharField(max_length=150, blank=True)
    field_of_study = models.CharField(max_length=150)

    institution = models.CharField(max_length=200)

    start_year = models.IntegerField(blank=True, null=True)
    end_year = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.professional.user.email


class Project(models.Model):

    professional = models.ForeignKey(
        ProfessionalInfo, on_delete=models.CASCADE, related_name="projects"
    )

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    github_link = models.URLField(blank=True)
    live_link = models.URLField(blank=True)

    technologies = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.professional.user.email
