from django.contrib import admin

from .models import Conversation, Message, UserGroup, UserProfile


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at", "updated_at", "group")
    search_fields = ("title", "group")


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("conversation", "query", "response", "updated_at")
    search_fields = ("query", "response")
    list_filter = ("conversation", "created_at")


@admin.register(UserGroup)
class UserGroupAdmin(admin.ModelAdmin):
    list_display = ("user", "group")
    search_fields = ("user", "group")
    list_filter = ("user", "group")


@admin.register(UserProfile)
class UserProfile(admin.ModelAdmin):
    list_display = ("user", "openai_api_key")
    search_fields = ("user", "openai_api_key")
    list_filter = ("user", "openai_api_key")
