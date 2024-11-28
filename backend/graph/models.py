from django.db import models

class Conversation(models.Model):
    """
    Represents a conversation consisting of multiple messages.
    """
    title = models.CharField(max_length=255, blank=True, null=True)  # Optional conversation title
    created_at = models.DateTimeField(auto_now_add=True)  # Automatically sets the time when the conversation is created
    updated_at = models.DateTimeField(auto_now=True)  # Automatically updates the time when a message in the conversation is modified

    def __str__(self):
        return self.title if self.title else f"Conversation {self.id}"


class Message(models.Model):
    """
    Represents a message (either a query or a response) within a conversation.
    Messages can have a parent-child relationship to represent branching conversations.
    """

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages'  # Allows reverse access to related messages
    )
    title = models.TextField()  # Conversation title
    query = models.TextField()  # Message content (query or response)
    response= models.TextField()  # Message content (query or response)
    parent_message = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)  # Reference to the parent message (for branching)
    created_at = models.DateTimeField(auto_now_add=True)  # Automatically sets the time when the message is created
    updated_at = models.DateTimeField(auto_now=True)  # Automatically updates the time when a message is modified

    def __str__(self):
        return f"{self.title}"  # Display the first 30 characters of the message in the admin

    def children(self):
        """
        Fetch all child messages that branch from this message.
        """
        return Message.objects.filter(parent_message=self)
