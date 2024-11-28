# views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from graph.models import Conversation # Update this line if necessary
from django.shortcuts import get_object_or_404
from rest_framework import status

from .serializers import ConversationDetailSerializer, ConversationTitleSerializer, MessageSerializer


@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, worlds!"})


class ConversationTitleListView(generics.ListAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationTitleSerializer


class ConversationDetailView(generics.RetrieveAPIView):
    queryset = Conversation.objects.all()
    serializer_class = ConversationDetailSerializer


class MessageCreateView(generics.CreateAPIView):
    """
    View to handle creating a new message in a conversation.
    """
    serializer_class = MessageSerializer

    def create(self, request, *args, **kwargs):
        convo_id = kwargs.get('convo_id')
        # Ensure the conversation exists
        conversation = get_object_or_404(Conversation, pk=convo_id)
        from pprint import pprint
        pprint(vars(conversation))
        print(convo_id)
        # Add the conversation ID to the incoming data
        data = request.data.copy()
        data['conversation'] = convo_id

        # Use the serializer to validate and save the message
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
