function addBookmark(event, listId){
    this.isBookmarked = true;
    $.get(urls.addBookmark(listId)).done(function(response){
        // console.log(response)
    })
}

function removeBookmark(event, listId){
    this.isBookmarked = false;
    $.get(urls.removeBookmark(listId)).done(function(response){
        // console.log(response)
    })
}

