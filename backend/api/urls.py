# urls.py
from django.urls import path
from .views import ConversationDetailView, ConversationTitleListView, hello_world
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('conversations/', ConversationTitleListView.as_view(), name='conversation-list'),  # Add this line
    path('conversations/titles/', ConversationTitleListView.as_view(), name='conversation-title-list'),
    path('conversations/<int:pk>/', ConversationDetailView.as_view(), name='conversation-detail'),
    path('hello/', hello_world, name='hello-world'),
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
