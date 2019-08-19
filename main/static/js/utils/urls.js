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

function getRemoveListUrl(listId){
    return `/deleteResourceList/${listId}`
}

