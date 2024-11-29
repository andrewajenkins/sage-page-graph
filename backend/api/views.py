# views.py

from django.contrib.auth import authenticate
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view
from graph.models import Conversation  # Update this line if necessary
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView

from .serializers import (
    ConversationDetailSerializer,
    ConversationTitleSerializer,
    MessageSerializer,
)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.response import Response


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        # Add custom data to the response
        response.data["user_message"] = "Token refreshed successfully!"
        return response


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims (e.g., group info)
        token["group"] = user.user_group.group.name
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(["GET"])
def hello_world(request):
    return Response({"message": "Hello, worlds!"})


class ConversationTitleListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Conversation.objects.all().order_by("-updated_at")
    serializer_class = ConversationTitleSerializer


class ConversationDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Conversation.objects.all()
    serializer_class = ConversationDetailSerializer


class MessageCreateView(generics.CreateAPIView):
    """
    View to handle creating a new message and optionally a new conversation.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer

    def create(self, request, *args, **kwargs):
        convo_id = kwargs.get("convo_id")

        # If no conversation ID is provided, create a new conversation
        if convo_id is None:
            # Create a new conversation (you can add logic to customize its properties)
            conversation = Conversation.objects.create(title=request.data["title"])
        else:
            # Ensure the conversation exists
            conversation = get_object_or_404(Conversation, pk=convo_id)

        # Add the conversation ID to the incoming data
        data = request.data.copy()
        data["conversation"] = conversation.id

        # Use the serializer to validate and save the message
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Include the conversation details in the response
        response_data = {
            "conversation": {
                "id": conversation.id,
                "created_at": conversation.created_at,  # Assuming Conversation has a timestamp field
                "updated_ad": conversation.updated_at,
            },
            "message": serializer.data,
        }
        return Response(response_data, status=status.HTTP_201_CREATED)


class ConvoDeleteView(APIView):
    """
    View to delete a conversation by its ID.
    """

    permission_classes = [IsAuthenticated]

    def delete(self, request, convo_id, *args, **kwargs):
        # Get the conversation or return a 404 if not found
        conversation = get_object_or_404(Conversation, pk=convo_id)

        # Perform the deletion
        conversation.delete()

        return Response(
            {"message": "Conversation deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )


class LoginView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)

        if user is not None:
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )
