var resourceListSummaryComponent = Vue.component('resource-list-summary', {
    props: ['resource-list', 'authenticated-user', 'bookmarks'],
    template: `
        <div class='resource-list-summary shadow-sm p-3'>
            <div class='row'>
                <div class='col-10'>
                    <a :href="getListUrl(resourceList.id)" class='link-title'>
                        {{ resourceList.title }}
                    </a>
                </div>
                <div class='col-2'>
                    <div v-if="authenticatedUser.id == resourceList.creator['id']" class="btn-group float-right ellipsis-button">
                        <i class="fas fa-ellipsis-v text-muted px-2" data-toggle="dropdown" aria-expanded="false"></i>
                        <div class="dropdown-menu dropdown-menu-right">
                            <a :href="renderEditResourceList(resourceList.creator.username, resourceList.id)" class='dropdown-item text-dark'>
                                Editar
                            </a>    
                            <a class="dropdown-item text-dark"
                                href="" @click="$emit('delete-list', $event, resourceList.id)">
                                Excluir Lista 
                            </a>
                        </div>
                    </div> 
                </div>
            </div>
            
            <div>
                <small>
                    por <a :href="getUserListUrl(resourceList.id)">{{ resourceList.creator['username'] }}</a>
                    <i v-if="authenticatedUser.id == resourceList.creator['id'] && resourceList.isPublic" class="fas fa-globe-americas ml-3"></i>
                    <i v-else-if="authenticatedUser.id == resourceList.creator['id'] && !resourceList.isPublic" class="fas fa-lock ml-3"></i>
                </small>
                <div class="row mt-2">
                    <div class="col-8">
                        <small>#{{ resourceList.category.name }}</small>
                    </div>
                    <div class="col-4">
                        <div v-if="authenticatedUser.id != ''">
                            <span v-if="isBookmarked(resourceList.id)" class="bookmark-icon" @click="removeBookmark($event, resourceList.id)"><i class="fas fa-bookmark mr-2"></i> Salvo</span>
                            <span v-else class="bookmark-icon mr-4" @click="addBookmark($event, resourceList.id)"><i class="far fa-bookmark mr-2"></i> Salvar</span>
                        </div>
                    </div>
                </div>
                <p class="resource-list-description">{{ resourceList.description }}</p>
                
                <span v-if="resourceList.requisites != '' && isShowingMore == false" v-on:click="isShowingMore = true" class="pointer text-green"><i class="fas fa-chevron-down"></i> Pré-requisitos / Público-alvo </span>
                
                <span v-if="isShowingMore" v-on:click="isShowingMore = false" class="pointer text-green"><i class="fas fa-chevron-up"></i> Pré-requisitos / Público-alvo </span>
                <p v-if="isShowingMore" class="resource-list-description mt-2">{{ resourceList.requisites }}</p>
            </div>
        </div>
    `,
    data: function(){
        return {
            isShowingMore: false,   
        }
    },
    methods: {
        getListUrl: function (listId) {
            for (var i = 0; i < resourceLists.length; i++) {
                if (resourceLists[i].id == listId) {
                    return `/u/${resourceLists[i].creator['username']}/list/${listId}`
                }
            }
        },
        renderEditResourceList: urls.renderEditResourceList,
        getUserListUrl: function (listId) {
            for (var i = 0; i < resourceLists.length; i++) {
                if (resourceLists[i].id == listId) {
                    return `/u/${resourceLists[i].creator['username']}/lists`
                }
            }
        },
        isBookmarked: function (listId) {
            for (var i = 0; i < this.bookmarks.length; i++) {
                if (this.bookmarks[i].resourceList == listId)
                    return true;
            }
            return false;
        },
        addBookmark: function addBookmark(event, listId){
            $.get(urls.addBookmark(listId)).done(function(response){
                // console.log(response)
                var bookmark = {
                    resourceList: listId
                }
                app.bookmarks.push(bookmark);
            })
        },
        removeBookmark: function removeBookmark(event, listId){
            $.get(urls.removeBookmark(listId)).done(function(response){
                // console.log(response)
                var removeIndex = app.bookmarks.map(function(item){
                    return item.resourceList;
                }).indexOf(listId);
                ~removeIndex && app.bookmarks.splice(removeIndex,1);
            })
        }

    }
})

var app = new Vue({
    delimiters: ['[[', ']]'],
    el: '#resource-lists',
    data: {
        resourceLists: resourceLists,
        authenticatedUser: authenticatedUser,
        bookmarks: bookmarks
    },
    methods: {
        deleteList: function (event, listId) {
            event.preventDefault();
            if (confirm("Realmente deseja excluir essa lista de materiais?")) {
                // Ajax to remove the resource list
                fetch(urls.getRemoveListUrl(listId))
                    .then((resp) => resp.json()) // Transform the data into json
                    .then(function (jsonResponse) {
                        if (!jsonResponse["error"]) {
                            app.resourceLists = resourceLists.filter(function (item) {
                                return (item.id != listId);
                            });
                        }
                        else
                            alert(jsonResponse);
                    })
            }
        }
    }
})

