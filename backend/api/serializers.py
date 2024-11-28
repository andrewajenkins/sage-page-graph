# serializers.py
from rest_framework import serializers
from graph.models import Conversation, Message  # Update this line
from rest_framework import serializers
from graph.models import Conversation, Message


class ConversationTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ['id', 'title']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'title', 'parent_message', 'query', 'response', 'created_at', 'updated_at']

class ConversationDetailSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'title', 'messages']