# urls.py
from django.urls import path
from .views import ConversationDetailView, ConversationTitleListView, hello_world, MessageCreateView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('conversations/', ConversationTitleListView.as_view(), name='conversation-list'),  # Add this line
    path('conversations/titles/', ConversationTitleListView.as_view(), name='conversation-title-list'),
    path('conversations/<int:pk>/', ConversationDetailView.as_view(), name='conversation-detail'),
    path('hello/', hello_world, name='hello-world'),
    path('conversations/<int:convo_id>/messages/', MessageCreateView.as_view(), name='message-create'),
    path('conversations/messages/', MessageCreateView.as_view(), name='new-message-create'),
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
