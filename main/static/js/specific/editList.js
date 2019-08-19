var editResource = Vue.component('edit-resource', {
    props: ['resource', 'resources'],
    template: `
        <div :id="'resource-' + resource.position" class='edit-resource-item mt-3 bg-white rounded p-2'>
            <div class='row no-gutters'>
                <div class='col-2 col-md-1 pr-2'>
                    <div class="text-center mt-3">
                    <select v-model="resource.position" @change="$emit('correct-resources-positions')" class="select-resource-position">
                        <option v-for="(item, index) in resources" v-bind:value="index + 1" >
                            {{ index + 1 }}
                        </option>
                    </select>
                    </div>
                    
                </div>
                <div class='col-9 col-md-10 px-2 edit-resource-info'>
                    <input v-model="resource.title" type="text"  class="edit-resource-input edit-resource-title-input"  placeholder="Orientação" spellcheck="false"/>
                    <div class="ellipsis">
                        <input v-model="resource.url" type="text" @paste="$emit('paste-url', $event, resource)" class="edit-resource-input edit-resource-url-input"  placeholder="Url do material" spellcheck="false"/>
                    </div>
                    <textarea v-model="resource.description" @keyup="autogrow($event)" class="edit-resource-input edit-resource-description-input" placeholder="Orientação extra" v-bind:data-position="resource.position" spellcheck="false"></textarea>
                    
                    <div class="row">
                        <div class="col-6">
                            <label>
                                <input v-model="resource.estimateMinutes" type="number" />
                                Tempo estimado (em minutos)
                            </label>
                        </div>
                        <div class="col-6">
                            <label>
                                <input type="checkbox" v-model="resource.isPaid"/> Conteúdo pago                
                            </label>
                        </div>
                        
                    </div>
                </div>
                <div class='col-1'>
                    <div class="float-right">
                        <i @click="$emit('delete-resource', $event, resource)" class="fas fa-times text-muted delete-resource-btn"></i>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        autogrow: function (event) {
            event.target.style.height = "0px";
            event.target.style.height = (event.target.scrollHeight) + "px";
        },

    },
    mounted: function () {
        // Carregar os <textarea> com a altura correspondente ao seu conteúdo
        var textareas = document.getElementsByClassName('edit-resource-description-input');
        for (var i = 0; i < textareas.length; i++) {
            if (textareas[i].dataset.position == this.resource.position) {
                textareas[i].style.height = textareas[i].scrollHeight + "px";
            }
        }

        // If there's #resource-id on the URL
        var resourceIdHash = window.location.hash;
        if(resourceIdHash){
            setTimeout(function(){
            
                window.location.href = resourceIdHash;
                console.log(resourceIdHash);
                scrollBy(0, -100);
                $(resourceIdHash).css({
                    "box-shadow": "0px 0px 30px -9px rgba(0,163,155,1)",
                    "transition": "0.5s"
                });
                setTimeout(function(){
                    $(resourceIdHash).css("box-shadow", "none");
                }, 1000)
            }, 500)
        
        }
        


        

    }
})


var vueResourceList = new Vue({
    delimiters: ['[[', ']]'],
    el: '#editing-resource-list',

    data: {
        resourceList: resourceList,

        showCategories: false,
        
        visibleCategories: [categories], // It follows an hierarchy. The first categories are the parents.

        resources: resources,
    },

    methods: {
        showSubcategories: function(category, hierarchyIndex){ 
            this.visibleCategories = this.visibleCategories.slice(0, hierarchyIndex + 1);
            if(category.subcategories && category.subcategories.length > 0){
                this.visibleCategories.push(category.subcategories);
            }

            // Reajust the min-height of each one, so it can't be smaller than the previous one
            setTimeout(function(){
                var categories = document.getElementsByClassName('categories');
                for(var i = 1; i < categories.length; i++){
                    if(categories[i].clientHeight < categories[i-1].clientHeight)
                        categories[i].style.minHeight = categories[i-1].clientHeight; 
                }
            }, 10)
          
        },
        hideAllCategories: function(){
            this.showCategories = false;
            this.visibleCategories = this.visibleCategories.slice(0, 1);
        },

        saveChanges: function () {
            var obj = {
                resourceList: resourceList,
                resources: resources
            }
            var formData = {
                csrfmiddlewaretoken: csrfmiddlewaretoken,
                obj: JSON.stringify(obj)
            }
            console.log(formData);

            $.ajax({
                url: "",
                type: "POST",
                data: formData,
                dataType: 'json',

                success: function (response) {
                    console.log(response);
                    if (response.errors) {
                        for (var error in response.errors)
                            consosole.log(error)
                    }
                    else {
                        window.location.href = urls.renderResourceList
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        },
        addResource: function () {
            var newResource = {
                creator: resourceList.creator,
                position: resources.length + 1,
                title: "",
                url: "",
                description: '',
                updatedAt: Date.now(),
                resourceList: resourceList.id,
                isPaid: false, 
                id: null,
                estimateMinutes: null
            }
            resources.push(newResource);
        },
        cancelEditing: function () {
            window.location.href = urls.renderResourceList
        },
        onPasteUrl: function (event, resource) {
            // console.log(event);
            // console.log(resource);
            setTimeout(function () {
                var url = event.target.value;
                if (url.includes('http') && resource.title == '') {
                    if (url.includes('youtube.com')) {
                        $.getJSON('https://noembed.com/embed', { format: 'json', url: url }, function (data) {
                            resource.title = data.title;
                        });
                    }
                    else {
                        fetch('https://textance.herokuapp.com/title/' + url)
                        .then((resp) => resp.text()) // Transform the data into json
                        .then(function (title) {
                                resource.title = title;
                        })
                    }
                }
            }, 0)
        }, 
        deleteResourceList: function(event, listId){
            event.preventDefault();
            if(confirm("Realmente deseja excluir essa lista?")){
                fetch(urls.deleteResourceList)
                .then((resp) => resp.json()) // Transform the data into json
                .then(function (jsonResponse) {
                    console.log(jsonResponse);
                    if(!jsonResponse["error"])
                        window.location.href = urls.renderUserResourceLists
                    else
                        alert(jsonResponse);
                })
            }
      
        },
        deleteResource: function(event, resource){
            var removeIndex = resources.map(function(item){
                return item.position;
            }).indexOf(resource.position);
            ~removeIndex && resources.splice(removeIndex,1);
            this.correctResourcePositions();
        },
        correctResourcePositions: function(){
            // First, order by position
            resources.sort((a, b) => (a.position > b.position) ? 1 : -1);
            // Then, reset the position of each resource
            for(var i = 0; i < resources.length; i++){
                resources[i].position = i+1;
            }
        }
    },
    mounted: function () {
        // Carregar os <textarea> com a altura correspondente ao seu conteúdo
        var textareas = document.getElementsByClassName('edit-list-textarea');
        for (var i = 0; i < textareas.length; i++) {
            textareas[i].style.height = textareas[i].scrollHeight + "px";
        }
    }
})
