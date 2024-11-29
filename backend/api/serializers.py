# serializers.py
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from graph.models import Conversation, Message


class ConversationTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ["id", "title"]


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = [
            "id",
            "title",
            "conversation",
            "parent_message",
            "query",
            "response",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class ConversationDetailSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ["id", "title", "messages"]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Ensure the user has a UserGroup
        from graph.models import UserGroup  # Import here to avoid circular imports
        from django.contrib.auth.models import Group

        user_group = getattr(user, "user_group", None)
        if not user_group:
            # Assign to a default group if no UserGroup exists
            default_group, created = Group.objects.get_or_create(name="Default")
            UserGroup.objects.create(user=user, group=default_group)

        # Add group claim
        token["group"] = user.user_group.group.name

        return token
