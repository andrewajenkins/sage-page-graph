from django.contrib.auth.models import Group, User
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UserGroup


@receiver(post_save, sender=User)
def create_user_group(sender, instance, created, **kwargs):
    if created:
        # Create a group for this user
        group = Group.objects.create(name=f"group_{instance.username}")
        # Link the user and the group
        UserGroup.objects.create(user=instance, group=group)
