from django.db.models import Q

from graph.models import Message

import tiktoken


def count_tokens(text, model="gpt-4"):
    """
    Count the number of tokens in the given text using tiktoken.
    """
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(text))


def truncate_to_words(text, word_limit=300):
    """
    Truncates the given text to the specified number of words.
    """
    words = text.split()
    return " ".join(words[:word_limit]) if len(words) > word_limit else text


def get_nearest_ancestors(current_message_id, count=5):
    """
    Fetch the current message and its nearest 'count' ancestors in the conversational graph.
    Traverses the parent pointers to build the chain of messages.
    """
    messages = []
    current_message = Message.objects.filter(id=current_message_id).first()

    while current_message and len(messages) < count:
        messages.append(current_message)
        current_message = current_message.parent_message  # Move to the parent node

    # Reverse the order to maintain chronological sequence
    return list(reversed(messages))
