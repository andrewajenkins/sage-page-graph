# views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from graph.models import Conversation # Update this line if necessary

from .serializers import ConversationDetailSerializer, ConversationTitleSerializer


@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, worlds!"})


class ConversationTitleListView(generics.ListAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationTitleSerializer


class ConversationDetailView(generics.RetrieveAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationDetailSerializer
