var resourceItem = Vue.component('resource-item', {
    props: ['resource', 'resource-list', 'authenticated-user'],
    template: `
        <div class='resource-item mt-3 bg-white border' :id="'resource-item-' + resource.position" >
            <div v-if="userIsCreator" class="btn-group">
                <i class="fas fa-ellipsis-v text-muted px-2" data-toggle="dropdown" aria-expanded="false"></i>
                <div class="dropdown-menu dropdown-menu-right">
                    <a class="dropdown-item" :href="getEditListUrl(resourceList.creator['username'], resourceList.id) + '#resource-' + resource.position" >
                        Editar item
                    </a>
                </div>
            </div>
            <div class="d-inline-flex">
                <div  v-if="authenticatedUser.id != ''" class="div-rating-btn" >
                    <i v-if="resource.userRating == null" 
                        v-on:click="updateRating(resource, 0)"
                        v-on:mouseover="showRatingOptions(resource)"
                        v-on:mouseleave="hideRatingOptions(resource)"
                        class="far fa-circle pointer rating-circle-icon"></i>
                    <i v-else-if="resource.userRating == 0" 
                    v-on:click="updateRating(resource, null)"
                    v-on:mouseover="showRatingOptions(resource)"
                        v-on:mouseleave="hideRatingOptions(resource)"
                        class="far fa-check-circle pointer rating-circle-icon "></i>
                    <span v-else-if="resource.userRating == 1"
                        v-on:click="updateRating(resource, null)"
                        v-on:mouseover="showRatingOptions(resource)"
                        v-on:mouseleave="hideRatingOptions(resource)"
                        class="pointer emoji-rating-span" >
                    ☹️
                    </span>
                    <span v-else-if="resource.userRating == 2"
                        v-on:click="updateRating(resource, null)"
                        v-on:mouseover="showRatingOptions(resource)"
                        v-on:mouseleave="hideRatingOptions(resource)"
                        class="pointer emoji-rating-span">
                    😐
                    </span>
                    <span v-else-if="resource.userRating == 3"
                        v-on:click="updateRating(resource, null)"
                        v-on:mouseover="showRatingOptions(resource)"
                        v-on:mouseleave="hideRatingOptions(resource)"
                        class="pointer emoji-rating-span">
                    😄
                    </span>

                    <transition name="fade">
                        <div v-if="resource.showRatingOptions == true"
                            class="rating-options shadow py-2 bg-white"
                            v-on:mouseover="showRatingOptions(resource)"
                            v-on:mouseleave="hideRatingOptions(resource)">
                            <div v-on:click="updateRating(resource, 3)" class="bg-white p-2 rounded pointer rating-option">😄 Muito interessante!</div>
                            <div v-on:click="updateRating(resource, 2)" class="bg-white p-2 rounded pointer rating-option">😐 OK</div>
                            <div v-on:click="updateRating(resource, 1)" class="bg-white p-2 rounded pointer rating-option" >☹️ Confuso</div>   
                        </div>
                    </transition>
                </div>
                <div class="d-inline-grid">
                    <div class="resource-item-title">{{ resource.title }}</div>
                    <div class="my-2 ellipsis">
                        <a :href="resource.url" target="_blank">{{ resource.url }}</a>
                    </div>
                    
                    <div class="row">
                        <div class="col-12">
                            <span v-if="resource.estimateMinutes != null && resource.estimateMinutes > 0"
                            class="mr-3" data-toggle="tooltip" data-placement="bottom" 
                            title="Tempo estimado"> 
                                <i class="fas fa-clock"></i> {{ friendlyMinutes(resource.estimateMinutes) }} 
                            </span>
                            <span v-if="resource.isPaid" class="text-orange">
                                <i class="fas fa-dollar-sign"></i> Conteúdo pago
                            </span>

                        </div>
                    </div>

                    <div v-if="resource.description != ''" class="mt-3">
                        <pre>{{ resource.description }}</pre>
                    </div>
                </div>
            </div>
        </div>
    `,
    computed: {
        userIsCreator: function(){
            if(this.authenticatedUser.id == this.resourceList.creator['id'])
                return true;
            return false;
        },
    },
    methods: {
        
        autogrow: function (event) {
            event.target.style.height = "50px";
            event.target.style.height = (event.target.scrollHeight) + "px";
        }, 
        showRatingOptions: function(resource){
            resource.showRatingOptions = true;
            resource.hideRatingOptions = false;
        },
        hideRatingOptions: function(resource){
            resource.hideRatingOptions = true;
            setTimeout(function(){
                if(resource.hideRatingOptions == true)
                    resource.showRatingOptions = false;
            }, 500)
        }, 
        updateRating: function(resource, newRating){
            resource.userRating = newRating;
            var postData = {
                csrfmiddlewaretoken: csrfmiddlewaretoken,
                jsResource: JSON.stringify(resource)
            };
            $.post(urls.updateRating, postData)
                .done(function (response) {
                    if(response.message =="OK"){
                        vueResourceList.avgRating = response.avgRating; 
                    }
                });

        }, 
        getEditListUrl: urls.getEditListUrl,
        friendlyMinutes: friendlyMinutes,

    },
    mounted: function () {
        // Carregar os <textarea> com a altura correspondente ao seu conteúdo
        var textareas = document.getElementsByClassName('edit-resource-description-input');
        for (var i = 0; i < textareas.length; i++) {
            if (textareas[i].dataset.position == this.resource.position) {
                textareas[i].style.height = textareas[i].scrollHeight + "px";
            }
        }
    }
})


var vueResourceList = new Vue({
    delimiters: ['[[', ']]'],
    el: '#resource-list',

    data: {
        resourceList: resourceList,
        resources: resources,
        authenticatedUser: authenticatedUser,
        isBookmarked: isBookmarked,
        ratings: ratings,
        avgRating: avgRating,

        // Sidebar
        sidebarIsOpen: true,
    },
    computed: {
        hasPaidResources: function(){
            var has = false;
            vueResourceList.resources.forEach(function(resource){
                if(resource.isPaid){
                    has = true;
                }
            })
            return has;
        },
        totalEstimatedMinutes: function(){
            var total = 0;
            this.resources.forEach(function(resource){
                if(resource.estimateMinutes != null)
                    total += resource.estimateMinutes;
            })
            return total;
        },
        hasAllEstimatedMinutes: function(){
            var has = true;
            this.resources.forEach(function(resource){
                if(resource.estimateMinutes > 0 == false ){
                    has = false;
                    return;
                }
            });
            return has;
        },
        nConcluded: function(){
            var n = 0;
            this.resources.forEach(function(resource){
                if(resource.userRating != null)
                    n++;
            });
            return n;
        },
        conclusionPct: function(){
            var pct = 0;
            var nResources = this.resources.length;
            pct = (Math.floor((this.nConcluded/nResources) * 100));
            return pct;
        }
    },
    methods: {
        getEditListUrl: urls.getEditListUrl,
        updateRating: function (event, resource) {
            var postData = {
                csrfmiddlewaretoken: csrfmiddlewaretoken,
                jsResource: JSON.stringify(resource)
            };
            $.post(urls.updateRating, postData)
                .done(function (response) {

                    if(response.message =="OK"){
                        vueResourceList.avgRating = response.avgRating; 
                        console.log(vueResourceList.avgRating)
                    }
                });
        },
        addBookmark: addBookmark,
        removeBookmark: removeBookmark,
        friendlyMinutes: friendlyMinutes,
        goToResourcePosition: function(hashtagAnchor){
            goToId(hashtagAnchor);
            $(hashtagAnchor).css({
                "box-shadow": "0px 0px 30px -9px rgba(0,163,155,1)",
                "transition": "0.5s"
            });
            setTimeout(function(){
                $(hashtagAnchor).css("box-shadow", "none");
            }, 1000)
           
            
        },
    },
    mounted: function(){
        $(function() {
            $('[data-toggle="tooltip"]').tooltip()
        })

        this.resourceList.relearnScore = Math.floor(this.resourceList.relearnScore)
    }
})
