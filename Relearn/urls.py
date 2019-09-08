from django.contrib import admin
from django.urls import path, include
from main import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    #Admin / Authenticate
    path('admin/', admin.site.urls), # Can't use 'name=""'
    path('accounts/', include('django.contrib.auth.urls')), 
    path('createUser', views.createUser, name='createUser'),
    path('logout', auth_views.LogoutView.as_view(next_page="renderIndex"), name='logout'),
    path('admin/settings', views.renderAdminSettings, name='renderAdminSettings'),

    #Render
    path('', views.renderIndex, name='renderIndex'),
    path('u/<str:username>/lists', views.renderUserResourceLists, name='renderUserResourceLists'),
    path('u/<str:username>/list/<int:listId>/edit', views.renderEditResourceList, name='renderEditResourceList'),
    path('u/<str:username>/list/<int:listId>', views.renderResourceList, name='renderResourceList'),
    path('bookmarked', views.renderBookmarked, name='renderBookmarked'),
    path('search', views.renderSearch, name="renderSearch"),

    #Ajax/JSON
    path('ajax/updateRating', views.updateRating, name='updateRating'),
    path('ajax/addBookmark/<int:listId>', views.addBookmark, name='addBookmark'),
    path('ajax/removeBookmark/<int:listId>', views.removeBookmark, name='removeBookmark'),

    #Others
    path('createResourceList', views.createResourceList, name='createResourceList'),
    path('deleteResourceList/<int:listId>', views.deleteResourceList, name="deleteResourceList"),
    path('u/<str:username>/list/<int:listId>/edit/addResource', views.addResource, name='addResource'),

    # User profile
    path('updateProfile/<int:userId>', views.updateProfile, name='updateProfile'),

]