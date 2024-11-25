from django.contrib import admin

from .models import Conversation, Message

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'updated_at')
    search_fields = ('title',)

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('conversation', 'query', 'response', 'created_at', 'updated_at')
    search_fields = ('query', 'response')
    list_filter = ('conversation', 'created_at')