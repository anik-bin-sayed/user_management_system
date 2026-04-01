from ..models.professional import *
from rest_framework import serializers


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name"]


class EducationalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationalInfo
        fields = [
            "id",
            "degree",
            "field_of_study",
            "institution",
            "start_year",
            "end_year",
        ]


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "description",
            "github_link",
            "live_link",
            "technologies",
        ]


class ProfessionalInfoSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, required=False)
    educations = EducationalInfoSerializer(many=True, required=False)
    projects = ProjectSerializer(many=True, required=False)

    class Meta:
        model = ProfessionalInfo
        fields = [
            "job_title",
            "company",
            "industry",
            "experience_years",
            "employment_type",
            "available_for_work",
            "skills",
            "educations",
            "projects",
        ]

    def create(self, validated_data):
        skills_data = validated_data.pop("skills", [])
        educations_data = validated_data.pop("educations", [])
        projects_data = validated_data.pop("projects", [])

        professional = ProfessionalInfo.objects.create(**validated_data)

        for skill_data in skills_data:
            Skill.objects.create(professional=professional, **skill_data)

        for education_data in educations_data:
            education_data.pop("id", None)  # Remove id if present
            EducationalInfo.objects.create(professional=professional, **education_data)

        for project_data in projects_data:
            project_data.pop("id", None)  # Remove id if present
            Project.objects.create(professional=professional, **project_data)

        return professional

    def update(self, instance, validated_data):
        skills_data = validated_data.pop("skills", None)
        educations_data = validated_data.pop("educations", None)
        projects_data = validated_data.pop("projects", None)

        # Update basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update skills
        if skills_data is not None:
            instance.skills.all().delete()
            for skill_data in skills_data:
                skill_data.pop("id", None)
                Skill.objects.create(professional=instance, **skill_data)

        # Update educations
        if educations_data is not None:
            instance.educations.all().delete()
            for education_data in educations_data:
                education_data.pop("id", None)
                EducationalInfo.objects.create(professional=instance, **education_data)

        # Update projects
        if projects_data is not None:
            instance.projects.all().delete()
            for project_data in projects_data:
                project_data.pop("id", None)
                Project.objects.create(professional=instance, **project_data)

        return instance
