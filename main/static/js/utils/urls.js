// Admin / Authenticate
urls["admin"] = "/admin/";
urls["createUser"] = "createUser";
urls["logout"] = "/logout/";

urls["addBookmark"] = function(listId){
    return `/ajax/addBookmark/${listId}`;
} 

urls["removeBookmark"] = function(listId){
    return `/ajax/removeBookmark/${listId}`;
} 

urls["login"] = "/accounts/login/";

urls.getEditListUrl = function(username,listId){
    return `/u/${username}/list/${listId}/edit`
}

urls.getRemoveListUrl = function(listId){
    return `/deleteResourceList/${listId}`
}

