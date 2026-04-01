from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, EmailVerificationToken


class UserAdmin(BaseUserAdmin):
    ordering = ("email",)
    list_display = ("email", "username", "is_verified", "is_locked", "is_staff")
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal info", {"fields": ("username", "full_name")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login",)}),
        ("Extra", {"fields": ("is_verified", "is_locked", "two_factor_enabled")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "username", "full_name", "password1", "password2"),
            },
        ),
    )


admin.site.register(User, UserAdmin)
admin.site.register(EmailVerificationToken)
