# urls.py
from django.urls import path
from .views import hello_world, ConversationListCreateView, MessageListCreateView
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),  # This enables access to the admin at /admin
    path('hello/', hello_world, name='hello_world'),
    path('conversations/', ConversationListCreateView.as_view(), name='conversation_list_create'),
    path('messages/', MessageListCreateView.as_view(), name='message_list_create'),
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
