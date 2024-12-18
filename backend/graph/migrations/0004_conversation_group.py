# Generated by Django 5.1.2 on 2024-11-29 16:41

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('graph', '0003_usergroup'),
    ]

    operations = [
        migrations.AddField(
            model_name='conversation',
            name='group',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='conversations', to='auth.group'),
        ),
    ]
