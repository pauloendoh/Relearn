from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Avg

import json

class Category(models.Model):
    name = models.CharField(max_length=255, default="Outros", null=False)
    parentCategory = models.ForeignKey('self', related_name='subcategories', null=True, on_delete=models.CASCADE)
    position = models.IntegerField(default=1) # Position of the category in that subcategory

    def natural_key(self):
        subcategories = []
        for subcategory in self.subcategories.all():
            subcategory = Category.natural_key(subcategory)
            subcategories.append(subcategories)
        return {'id': self.id, 'name': self.name, 'subcategories': subcategories}
    
    def getCategoryTreeJSON(self):
        categoryTree = []

        coreCategories = self.objects.filter(parentCategory=None)
        for coreCategory in coreCategories:
            objDict = {
                'id': coreCategory.id,
                'name': coreCategory.name,
                'parentCategory': None,
                'position': coreCategory.position
            }
            if(coreCategory.subcategories.count() > 0):
                objDict["subcategories"] = coreCategory.getSubcategoriesDictList()
            else:
                objDict["subcategories"] = None
            categoryTree.append(objDict)
        categoryTree = sorted(categoryTree, key=lambda k: k["position"])
        return json.dumps(categoryTree)
    
    def getSubcategoriesDictList(self):
        dictList = []
        for subcategory in self.subcategories.all():
            objDict = {
                'id': subcategory.id,
                'name': subcategory.name,
                'parentCategory': subcategory.parentCategory.id,
                'position': subcategory.position
            }
            if(subcategory.subcategories.count() > 0):
                objDict["subcategories"] = subcategory.getSubcategoriesDictList()
            else:
                objDict["subcategories"] = None
            dictList.append(objDict)
        dictList = sorted(dictList, key=lambda k: k["position"])
        return dictList

class ResourceList(models.Model):
    creator = models.ForeignKey(
        User, related_name="resourceLists", on_delete=models.CASCADE)
    title = models.CharField(max_length=255, null=True,
                             default="Sem título")
    description = models.TextField(null=True, default="")
    requisites = models.TextField(null=True, default="")
    isPublic = models.BooleanField(default=False)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    category = models.ForeignKey(Category, related_name="resourceLists", on_delete=models.CASCADE)
    nStudents = models.IntegerField(default=0) # Number of students that complted a resource from this list
    relearnScore = models.FloatField(default=0) # Average rating from the students, in percentage

    # Refreshes the nStudents and relearnScore 
    def calcRelearnScore(self):
        diffUser = []
        nRatings = 0
        ratingSum = 0
        avgRating = 0

        for resource in self.resources.all():
            for rating in resource.ratings.all():
                if(rating.rating != None and rating.rating > 0):
                    nRatings += 1
                    ratingSum += rating.rating
                if(rating.user not in diffUser):
                    diffUser.append(rating.user)
        self.nStudents = len(diffUser)
       
        avgRating = round((((ratingSum/nRatings)-1)/2) * 100, 2)
        self.relearnScore = avgRating

        print(self.relearnScore,self.nStudents, ratingSum, nRatings)
        self.save()

    def getUserAvgRating(self, user):
        avgRating = 0
        resources = Resource.objects.filter(resourceList = self)
        userRatings = Rating.objects.filter(user = user, resourceList = self, rating__gte=0)
        # I'm still not calculating with none types
        if(len(resources) > 0):
            avgRating = round(sum(r.rating for r in userRatings) / float(len(resources)), 1)

        return avgRating


class Resource(models.Model):
    creator = models.ForeignKey(
        User, related_name="resources", on_delete=models.CASCADE)
    position = models.IntegerField(null=False)
    title = models.CharField(max_length=255, default="", null=True)
    url = models.CharField(max_length=255, default="", null=False)
    description = models.TextField(null=True, default="")
    updatedAt = models.DateTimeField(auto_now=True)
    resourceList = models.ForeignKey(
        ResourceList, on_delete=models.CASCADE, related_name="resources")
    avgRating = models.FloatField(null=True, blank=True)
    votesCount = models.FloatField(null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    estimateMinutes = models.FloatField(null=True)

    def calcAvgRating(self):
        self.avgRating = self.ratings.all().aggregate(Avg('rating')).get('rating__avg')
        self.votesCount = self.ratings.all().count()
        self.save()            


class Rating(models.Model):
    user = models.ForeignKey(
        User, related_name="ratings", on_delete=models.CASCADE)
    resource = models.ForeignKey(
        Resource, related_name="ratings", on_delete=models.CASCADE)
    resourceList = models.ForeignKey(ResourceList, related_name="ratings", on_delete=models.CASCADE)
    rating = models.FloatField(null=True, blank=True)

class BookmarkedList(models.Model):
    resourceList = models.ForeignKey(ResourceList, related_name="bookmarked", on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name="bookmarked", on_delete=models.CASCADE)
