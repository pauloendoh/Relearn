# Generated by Django 2.2 on 2019-07-30 00:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0015_rating_resourcelist'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resourcelist',
            name='title',
            field=models.CharField(default='Sem título', max_length=255, null=True),
        ),
    ]
