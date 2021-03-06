# Generated by Django 2.2 on 2019-07-08 12:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_auto_20190708_0929'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='resource',
            name='recommendationList',
        ),
        migrations.AddField(
            model_name='resource',
            name='resourceList',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, related_name='resources', to='main.ResourceList'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='resource',
            name='creator',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='resources', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='resourcelist',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='resourceLists', to=settings.AUTH_USER_MODEL),
        ),
    ]
