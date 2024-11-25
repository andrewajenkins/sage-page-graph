from django.core.management.base import BaseCommand
from graph.models import Conversation, Message

class Command(BaseCommand):
    help = 'Populate the database with test data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--fresh',
            action='store_true',
            help='Wipe the current data before inserting new test data',
        )

    def handle(self, *args, **kwargs):
        fresh = kwargs['fresh']

        if fresh:
            self.stdout.write('Wiping existing data...')
            Conversation.objects.all().delete()
            Message.objects.all().delete()
            self.stdout.write('Existing data wiped.')

        # Define the test data
        data = [
            {
                'title': 'Double-Slit Experiment',
                'query': 'Explain the double-slit experiment',
                'response': 'The double-slit experiment is a demonstration that light and matter can display characteristics of both classically defined waves and particles. It was first performed by Thomas Young in 1801. The experiment involves shining a light through two closely spaced slits and observing the resulting pattern on a screen. The pattern shows interference fringes, which are characteristic of waves, even when particles (such as electrons) are sent through the slits one at a time.',
                'queries': [
                    {
                        'title': 'Wave-Particle Duality',
                        'query': 'What is wave-particle duality?',
                        'response': 'Wave-particle duality is the concept in quantum mechanics that every particle or quantum entity can exhibit both wave-like and particle-like properties. This duality is a fundamental aspect of quantum mechanics and is best illustrated by the double-slit experiment. When particles such as electrons are not observed, they exhibit wave-like behavior, creating an interference pattern. However, when they are observed, they behave like particles, hitting the screen at discrete points.',
                        'queries': [],
                    },
                ],
            },
            {
                'title': 'Artificial Intelligence',
                'query': 'Artificial Intelligence',
                'response': 'Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning (the acquisition of information and rules for using the information), reasoning (using rules to reach approximate or definite conclusions), and self-correction. AI applications include expert systems, natural language processing (NLP), speech recognition, and machine vision.',
                'queries': [
                    {
                        'title': 'Machine Learning',
                        'query': 'What is machine learning?',
                        'response': 'Machine learning is a subset of artificial intelligence that involves the use of algorithms and statistical models to enable computers to perform specific tasks without using explicit instructions. It relies on patterns and inference instead. Machine learning algorithms build a model based on sample data, known as training data, to make predictions or decisions without being explicitly programmed to perform the task.',
                        'queries': [
                            {
                                'title': 'Supervised Learning',
                                'query': 'Explain supervised learning',
                                'response': 'Supervised learning is a type of machine learning where the model is trained on labeled data. This means that each training example is paired with an output label. The algorithm learns to map inputs to the desired output by finding patterns in the training data. Common algorithms used in supervised learning include linear regression, logistic regression, and support vector machines.',
                                'queries': [],
                            },
                        ],
                    },
                ],
            },
        ]

        # Insert the data into the database
        for index, conversation_data in enumerate(data):
            conversation = Conversation.objects.create(
                title=str(index) + "_" + conversation_data['title'],
            )
            message = Message.objects.create(
                parent_message=None,
                conversation=conversation,
                query=conversation_data['query'],
                response=conversation_data['response'],
            )
            self._create_messages(conversation, message, conversation_data['queries'])

        self.stdout.write(self.style.SUCCESS('Successfully populated the database with test data'))

    def _create_messages(self, conversation, parent, messages_data):
        for message_data in messages_data:
            message = Message.objects.create(
                parent_message=parent,
                conversation=conversation,
                query=message_data['query'],
                response=message_data['response'],
            )
            self._create_messages(conversation, message, message_data['queries'])