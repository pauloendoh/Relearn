from django.shortcuts import render, redirect, get_object_or_404
from main.forms import SignUpForm
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.core.serializers import serialize, deserialize
from django.forms import model_to_dict
from django.contrib.auth.decorators import login_required

from main.models import ResourceList, Resource, Rating, BookmarkedList, Category

import json
from main import jsonModels


def renderIndex(request):
    returns = {}
    returns["jsonResourceLists"] = jsonModels.getResourceLists(
        isPublic=True, order_by="-updatedAt")

    if request.user.is_authenticated:
        returns["jsonBookmarks"] = jsonModels.getBookmarks(user=request.user)
    else:
        returns['SignUpForm'] = SignUpForm()

    return render(request, 'index.html', returns)


def renderUserResourceLists(request, username):
    returns = {
        "jsonResourceLists": "[]",
        "jsonBookmarks": "[]"
    }
    if request.user.is_authenticated is False:
        returns['SignUpForm'] = SignUpForm()
    

    user = get_object_or_404(User, username=username)
    returns["user"] = user

    # jsonResourceLists
    if(request.user.is_authenticated and request.user == user):
        returns["jsonResourceLists"] = jsonModels.getResourceLists(
            user=user, order_by="-updatedAt")
    else:
        returns["jsonResourceLists"] = jsonModels.getResourceLists(
            user=user, isPublic=True, order_by="-updatedAt")

    # jsonBookmarks
    if(request.user.is_authenticated):
        returns["jsonBookmarks"] = jsonModels.getBookmarks(user=request.user)

    return render(request, 'user/userLists.html', returns)


@login_required
def renderEditResourceList(request, username, listId):
    if request.user.username == username:
        if request.method == "POST":
            updateResourceList(request)
            jsonResult = {"message": "OK"}
            return JsonResponse(jsonResult)
        else:
            returns = {}
            resourceList = get_object_or_404(ResourceList, id=listId)
            returns["resourceList"] = resourceList
            
            # jsonResourceList, jsonResources, jsonCategories
            returns["jsonResourceList"] = serialize(
                'json', [resourceList], use_natural_foreign_keys=True)
            returns["jsonResources"] = serialize(
                'json', Resource.objects.filter(
                    resourceList=resourceList).order_by('position'), use_natural_foreign_keys=True)
            returns["jsonCategories"] = Category.getCategoryTreeJSON(Category)

            return render(request, 'user/editList.html', returns)
    else:
        return redirect('renderIndex')


def renderResourceList(request, username, listId):
    returns = {}
    if request.user.is_authenticated is False:
        returns['SignUpForm'] = SignUpForm()
    resourceList = get_object_or_404(
        ResourceList, id=listId)
    if not resourceList.isPublic:
        if resourceList.creator != request.user:
            return renderIndex(request)
    returns["resourceList"] = resourceList

    resources = Resource.objects.filter(
        resourceList=resourceList).order_by('position')
    returns["jsonResourceList"] = serialize(
        'json', [resourceList],  use_natural_foreign_keys=True)
    returns["jsonResources"] = serialize(
        'json', resources,  use_natural_foreign_keys=True)

    # Get user's rating and check if list is bookmarked
    ratings = []
    avgRating = 0
    isBookmarked = False

    if request.user.is_authenticated:
        ratings = Rating.objects.filter(
            user=request.user, resourceList=resourceList)
        isBookmarked = True if BookmarkedList.objects.filter(
            resourceList=resourceList, user=request.user).exists() else False
        avgRating = resourceList.getUserAvgRating(user=request.user)

    returns["jsonRatings"] = serialize(
        'json', ratings, use_natural_foreign_keys=True)
    returns["avgRating"] = avgRating
    returns["isBookmarked"] = isBookmarked
    return render(request, 'user/resourceList.html', returns)


@login_required
def renderBookmarked(request):
    returns = {}
    bookmarkedLists = BookmarkedList.objects.filter(user=request.user)
    resourceLists = []
    for bookmark in bookmarkedLists:
        resourceList = ResourceList.objects.get(id=bookmark.resourceList.id)
        resourceLists.append(resourceList)
    returns["jsonResourceLists"] = serialize(
        'json', resourceLists, use_natural_foreign_keys=True)

    returns["jsonBookmarks"] = serialize(
        'json', BookmarkedList.objects.filter(user=request.user), use_natural_foreign_keys=True)

    return render(request, 'bookmarked.html',  returns)


def renderSearch(request):
    returns = {}
    if request.user.is_authenticated is False:
        returns['SignUpForm'] = SignUpForm()
    resourceLists = ResourceList.objects.filter(
        title__icontains=request.GET['q'])
    returns["jsonResourceLists"] = serialize(
        'json', resourceLists, use_natural_foreign_keys=True)
    return render(request, 'index.html', returns)


@login_required
def createResourceList(request):
    try:
        othersCategory = Category.objects.get(name="Outros")
    except:
        othersCategory = Category.objects.create(name="Outros", parentCategory=None, position=999)
    resourceList = ResourceList.objects.create(
        creator=request.user, 
        category=othersCategory)
    return redirect(renderEditResourceList, request.user.username, resourceList.id)


def updateResourceList(request):
    jsResourceList = json.loads(request.POST["obj"])

    # Update resource list info
    resourceList = jsonModels.updateResourceList(
        jsResourceList["resourceList"])

    # Remove resources which are not in jsResources anymore
    jsResources = jsResourceList["resources"]
    jsonModels.removeResources(jsResources)

    # Then, create or update resources
    for jsResource in jsResources:
        if(jsResource["id"] is None):
            jsonModels.createResource(jsResource)
        else:
            jsonModels.updateResource(jsResource)
    return


@login_required
def addResource(request, username, listId):
    jsonResult = {}

    # If the authenticated user is the creator of the list
    if(request.user.username == username):

        resourceList = ResourceList.objects.get(id=listId)
        resources = Resource.objects.filter(
            resourceList=resourceList)
        newResource = Resource.objects.create(
            creator=request.user,
            resourceList=resourceList,
            position=resources.count()+1)

        jsonResult["newResource"] = serialize(
            'json', [newResource])

    return JsonResponse(jsonResult)


def createUser(request):
    jsonResult = {}
    if request.method == 'POST':
        signUpData = SignUpForm(request.POST)
        if signUpData.is_valid():
            signUpData.save()
            signUpData.login(request)
            jsonResult["result"] = "OK"
        else:
            jsonResult["result"] = "ERROR"
            jsonResult["errors"] = signUpData.errors
    return JsonResponse(jsonResult)


def authenticateUser(request):
    jsonResult = {}
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
    else:
        jsonResult["error"] = "Nome de usuário ou senha incorreta."
    return JsonResponse(jsonResult)


def deleteResourceList(request, listId):
    jsonResponse = {}
    resourceList = ResourceList.objects.get(id=listId)
    if request.user == resourceList.creator:
        resourceList.delete()
        jsonResponse["message"] = "Success"
    else:
        jsonResponse["message"] = "Error"
        jsonResponse["error"] = "This user isn't allowed to delete this resource list."
    return JsonResponse(jsonResponse)


def updateRating(request):
    jsonResult = {"message": ""}

    if request.method == "POST" and request.user.is_authenticated:
        jsonResult = {"message": "OK"}

        jsResource = json.loads(request.POST["jsResource"])

        resource = Resource.objects.get(id=jsResource["id"])
        resourceList = ResourceList.objects.get(id=resource.resourceList.id)
        rating = Rating.objects.get_or_create(
            user=request.user, resource=resource, resourceList=resourceList)[0]
        if(jsResource["userRating"] == ''):
            rating.delete()
        else:
            if(jsResource["userRating"] == None):
                rating.rating = None
            else:
                rating.rating = float(jsResource["userRating"])
            rating.save()
        resource.calcAvgRating()
        resourceList.calcRelearnScore()
        jsonResult["avgRating"] = resourceList.getUserAvgRating(
            user=request.user)

    else:
        jsonResult["message"] = "Error"
        jsonResult["error"] = "Invalid request."
    return JsonResponse(jsonResult)


def addBookmark(request, listId):
    jsonResult = {"message": "Error"}

    if request.user.is_authenticated:
        resourceList = ResourceList.objects.get(id=listId)
        BookmarkedList.objects.create(
            resourceList=resourceList, user=request.user)
        jsonResult["message"] = "Success"
    return JsonResponse(jsonResult)


def removeBookmark(request, listId):
    jsonResult = {"message": "Error"}

    if request.user.is_authenticated:
        resourceList = ResourceList.objects.get(id=listId)
        bookmark = BookmarkedList.objects.get(
            resourceList=resourceList, user=request.user)
        bookmark.delete()
        jsonResult["message"] = "Success"
    return JsonResponse(jsonResult)
