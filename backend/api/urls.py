# urls.py
from django.urls import path
from .views import (
    ConversationDetailView,
    ConversationTitleListView,
    MessageCreateView,
    ConvoDeleteView,
    LoginView,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    OpenAIQueryView,
)
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path(
        "conversations/", ConversationTitleListView.as_view(), name="conversation-list"
    ),
    path(
        "conversations/titles/",
        ConversationTitleListView.as_view(),
        name="conversation-title-list",
    ),
    path(
        "conversations/<int:pk>/detail/",
        ConversationDetailView.as_view(),
        name="conversation-detail",
    ),
    path(
        "conversations/<int:convo_id>/messages/",
        MessageCreateView.as_view(),
        name="message-create",
    ),
    path(
        "conversations/messages/",
        MessageCreateView.as_view(),
        name="new-message-create",
    ),
    path(
        "conversations/<int:convo_id>/delete/",
        ConvoDeleteView.as_view(),
        name="convo-delete",
    ),
    path("login/", LoginView.as_view(), name="login"),
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("openai/query/", OpenAIQueryView.as_view(), name="openai-query"),
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
