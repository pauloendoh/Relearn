# Generated by Django 2.2 on 2019-07-10 18:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0011_auto_20190710_1546'),
    ]

    operations = [
        migrations.AddField(
            model_name='resource',
            name='numVotes',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
