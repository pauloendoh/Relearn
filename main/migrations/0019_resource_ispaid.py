# Generated by Django 2.2 on 2019-08-01 01:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0018_auto_20190731_2236'),
    ]

    operations = [
        migrations.AddField(
            model_name='resource',
            name='isPaid',
            field=models.BooleanField(default=False),
        ),
    ]
