from main.models import ResourceList, Resource, Rating, BookmarkedList, Category
from django.core.serializers import serialize, deserialize
from django.contrib.auth.models import User

import json

'''
JSON/Django models related functions
- get -> will return JSON by using specific parameters
- update, create, delete -> receive JSON parameters
'''

def getResourceLists(*args, **kwargs):
    user = kwargs.get('user', None)
    isPublic = kwargs.get('isPublic', None)
    order_by = kwargs.get("order_by", None)

    resourceLists = ResourceList.objects.all()

    if(user != None):
        resourceLists = resourceLists.filter(creator=user)
    if(isPublic != None):
        resourceLists = resourceLists.filter(isPublic=isPublic)
    if(order_by != None):
        resourceLists = resourceLists.order_by(order_by)
        
    return serialize('json', resourceLists, use_natural_foreign_keys=True)

def getBookmarks(**kwargs):
    user = kwargs.get('user', None)

    bookmarks = BookmarkedList.objects.filter(user=user)
    return serialize('json', bookmarks, use_natural_foreign_keys=True)


def updateResourceList(json):
    resourceListId = json["id"]
    resourceList = ResourceList.objects.get(id=resourceListId)
    
    resourceList.title = json["title"]
    resourceList.description = json["description"]
    resourceList.requisites = json["requisites"]
    resourceList.isPublic = json["isPublic"]
    resourceList.category = Category.objects.get(id=json["category"]["id"])
    
    resourceList.save()

    return resourceList


# Remove resources that are not on the jsResources (a list) anymore
def removeResources(jsResources):
    if (len(jsResources) > 0):
        resourceList = ResourceList.objects.get(id=jsResources[0]["resourceList"])
        resources = Resource.objects.filter(resourceList=resourceList)
        for resource in resources:
            stillExists = False
            for jsResource in jsResources:
                if(jsResource["id"] == resource.id):
                    stillExists = True
            if stillExists == False:
                resource.delete()
    
    return

def createResource(jsResource):
    resourceList = ResourceList.objects.get(id=jsResource["resourceList"])
    try:
        creator = User.objects.get(id=jsResource["creator"]["id"])
    except:
        creator = User.objects.get(username=jsResource["creator"]["username"])
    newResource = Resource.objects.create(
        creator=creator,
        position=jsResource["position"],
        title=jsResource["title"],
        url=jsResource["url"],
        description=jsResource["description"],
        isPaid=jsResource["isPaid"],
        estimateMinutes=jsResource['estimateMinutes'],
        resourceList=resourceList
    )
    return newResource            

def updateResource(jsResource):
    resource = Resource.objects.get(id=jsResource["id"])

    resource.position = jsResource["position"]
    resource.title = jsResource["title"]
    resource.url = jsResource["url"]
    resource.description = jsResource["description"]
    resource.isPaid = jsResource["isPaid"]
    resource.estimateMinutes = jsResource["estimateMinutes"]
    resource.save()

    return resource