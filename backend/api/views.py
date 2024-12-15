# views.py

from django.contrib.auth import authenticate
from rest_framework import generics

from graph.utils import (
    truncate_to_words,
    count_tokens,
    get_nearest_ancestors,
)
from .serializers import (
    ConversationDetailSerializer,
    MessageSerializer,
)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.permissions import IsAuthenticated, AllowAny
from graph.models import Conversation, UserGroup
from .serializers import ConversationTitleSerializer
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import requests
from django.contrib.auth.models import User, Group
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from graph.models import UserGroup


class OpenAIQueryView(APIView):
    """
    View to handle OpenAI API queries.
    """

    def post(self, request, *args, **kwargs):
        api_url = "https://api.openai.com/v1/chat/completions"
        model = request.data.get("model", "gpt-4")
        prompt = request.data.get("messages", [{"content": ""}])[-1]["content"]
        temperature = request.data.get("temperature", 0.7)
        max_tokens = request.data.get("max_tokens", 1000)
        current_message_id = request.data.get("current_message_id")

        # Initialize the `messages` object with the system message
        messages = [{"role": "system", "content": "You are a helpful assistant."}]
        total_tokens = count_tokens("You are a helpful assistant.", model=model)

        if current_message_id:
            # Fetch the current message and its nearest ancestors
            nearest_messages = get_nearest_ancestors(current_message_id, count=5)

            # Process the ancestors and add them to `messages`
            for message in nearest_messages:
                truncated_query = truncate_to_words(message.query, word_limit=100)
                truncated_response = truncate_to_words(message.response, word_limit=100)

                # Count tokens for the query and response
                query_tokens = count_tokens(truncated_query, model=model)
                response_tokens = count_tokens(truncated_response, model=model)

                total_tokens += query_tokens + response_tokens

                # Add to the messages object
                messages.append({"role": "user", "content": truncated_query})
                messages.append({"role": "assistant", "content": truncated_response})

            print(f"Total tokens for nearest ancestors: {total_tokens}")

        # Add the user's current prompt
        messages.append({"role": "user", "content": prompt})
        total_tokens += count_tokens(prompt, model=model)

        # Ensure total tokens are within limit
        if total_tokens > 4096:
            return Response(
                {
                    "error": "Token limit exceeded. Please simplify your query or reduce context."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Prepare the API request body
        body = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        print(body)

        headers = {
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
            "Content-Type": "application/json",
        }

        try:
            # Make the API request
            response = requests.post(api_url, json=body, headers=headers)
            response.raise_for_status()
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


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


class ConversationTitleListView(APIView):
    """
    View to list conversations for the authenticated user's group.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get the user's group via UserGroup
        user_group = get_object_or_404(UserGroup, user=request.user).group
        print(user_group)
        # Filter conversations by the user's group
        conversations = Conversation.objects.filter(group=user_group).order_by(
            "-updated_at"
        )
        print(conversations)

        # Serialize the filtered conversations
        serializer = ConversationTitleSerializer(conversations, many=True)

        return Response(serializer.data)


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
            user_group = get_object_or_404(UserGroup, user=request.user).group
            # Create a new conversation (you can add logic to customize its properties)
            conversation = Conversation.objects.create(
                title=request.data["title"], group=user_group
            )
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


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Get data from request
        username = request.data.get("username")
        password = request.data.get("password")
        key = request.data.get(
            "key"
        )  # Assuming key is for registration (e.g., OpenAI key)

        # Check if the user already exists
        if User.objects.filter(username=username).exists():
            return Response(
                {"message": "User already exists"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Create new user
        user = User.objects.create_user(username=username, password=password)

        # Optionally, assign the user to a group (UserGroup)
        try:
            group = Group.objects.get(
                name=username
            )  # Use an existing group or create one
        except ObjectDoesNotExist:
            # Create a new group if it doesn't exist
            group = Group.objects.create(name=username)

        # Create a UserGroup association
        UserGroup.objects.create(user=user, group=group)

        # Generate JWT tokens (access and refresh tokens)
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        # Optional: Store the OpenAI key or use it for something
        # user_profile = UserProfile.objects.create(user=user, openai_key=key)

        # Set tokens in the response
        return Response(
            {
                "message": "User registered successfully",
                "access_token": access_token,
                "refresh_token": refresh_token,
            },
            status=status.HTTP_201_CREATED,
        )
