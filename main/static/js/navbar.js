var navbar = new Vue({
    delimiters: ['[[', ']]'],
    el: '#navbar',
    data: {
        links: [
            { title: 'Login', href: urls.login, onClick: '' },
            { title: 'Registrar', href: '#', onClick: 'navbar.openAuthenticationModal()' },
        ],

        window: {
            width: 0,
            height: 0
        },

        searchBoxIsShowing: false,
    },
    created() {
        window.addEventListener('resize', this.handleResize)
        this.handleResize();
    },
    methods: {
        openAuthenticationModal: function () {
            $('#auth-modal').modal();
        },
        toggleSidebar: function () {
            if (vueResourceList != undefined)
                vueResourceList.sidebarIsOpen = !vueResourceList.sidebarIsOpen;
        },
        handleResize() {
            this.window.width = window.innerWidth;
            this.window.height = window.innerHeight;
        },
        showSearchbox: function(searchBoxIsShowing){
            this.searchBoxIsShowing = searchBoxIsShowing;
            
            if(searchBoxIsShowing){
                setTimeout(function(){
                    $('#minimized-searchbox').focus();
                }, 50)
            }
        },
    }
})