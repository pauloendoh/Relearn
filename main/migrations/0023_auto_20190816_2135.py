# Generated by Django 2.2 on 2019-08-17 00:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0022_auto_20190810_1542'),
    ]

    operations = [
        migrations.AddField(
            model_name='resourcelist',
            name='nStudents',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='resourcelist',
            name='relearnScore',
            field=models.FloatField(default=0),
        ),
    ]
