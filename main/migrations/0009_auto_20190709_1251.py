# Generated by Django 2.2 on 2019-07-09 15:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0008_auto_20190708_0947'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resource',
            name='title',
            field=models.CharField(default='', max_length=255, null=True),
        ),
    ]
