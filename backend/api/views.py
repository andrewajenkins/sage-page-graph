# views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from graph.models import Conversation, Message  # Update this line if necessary
from .serializers import ConversationSerializer, MessageSerializer

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, world!"})

class ConversationListCreateView(generics.ListCreateAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

class MessageListCreateView(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer