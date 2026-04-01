from allauth.account.adapter import DefaultAccountAdapter


class CustomAccountAdapter(DefaultAccountAdapter):

    def populate_user(self, request, sociallogin, data):
        user = super().populate_user(request, sociallogin, data)

        # For new social users, mark them active & verified before saving
        if hasattr(user, "is_active"):
            user.is_active = True
        if hasattr(user, "is_verified"):
            user.is_verified = True

        return user

    def is_active(self, user):

        # If our custom User model has these flags, ensure they are set
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

       
        return True
