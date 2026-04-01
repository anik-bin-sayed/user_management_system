from django.contrib.auth import get_user_model

from allauth.socialaccount.adapter import DefaultSocialAccountAdapter


User = get_user_model()


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):

    def pre_social_login(self, request, sociallogin):

        user = sociallogin.user

        if not user.pk and user.email:
            try:
                existing = User.objects.get(email__iexact=user.email)
                sociallogin.connect(request, existing)
                user = existing
            except User.DoesNotExist:

                pass

        changed = False
        if hasattr(user, "is_active") and not user.is_active:
            user.is_active = True
            changed = True
        if hasattr(user, "is_verified") and not getattr(user, "is_verified", False):
            user.is_verified = True
            changed = True

        if changed and user.pk:

            update_fields = []
            if hasattr(user, "is_active"):
                update_fields.append("is_active")
            if hasattr(user, "is_verified"):
                update_fields.append("is_verified")
            if update_fields:
                user.save(update_fields=update_fields)

    def save_user(self, request, sociallogin, form=None):

        user = super().save_user(request, sociallogin, form=form)

        changed = False
        if hasattr(user, "is_active") and not user.is_active:
            user.is_active = True
            changed = True
        if hasattr(user, "is_verified") and not getattr(user, "is_verified", False):
            user.is_verified = True
            changed = True

        if changed:
            update_fields = []
            if hasattr(user, "is_active"):
                update_fields.append("is_active")
            if hasattr(user, "is_verified"):
                update_fields.append("is_verified")
            if update_fields:
                user.save(update_fields=update_fields)

        return user
