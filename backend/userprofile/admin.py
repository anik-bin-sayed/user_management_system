from django.contrib import admin

from .models import *

# Register your models here.


admin.site.register(UserProfile)
admin.site.register(ProfessionalInfo)
admin.site.register(Skill)
admin.site.register(EducationalInfo)
admin.site.register(Project)

admin.site.register(UserProfilePhoto)
