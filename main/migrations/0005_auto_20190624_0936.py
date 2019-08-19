# Generated by Django 2.2 on 2019-06-24 12:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_recommendation_creator'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recommendation',
            name='description',
            field=models.TextField(default='', null=True),
        ),
        migrations.AlterField(
            model_name='recommendation',
            name='title',
            field=models.CharField(default='No title', max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='recommendation',
            name='url',
            field=models.CharField(default='', max_length=255),
        ),
    ]
