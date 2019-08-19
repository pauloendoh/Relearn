var navbar = new Vue({
    delimiters: ['[[', ']]'],
    el: '#navbar',
    data: {
        links: [
            { title: 'Login', href: urls.login, onClick: '' },
            { title: 'Registrar', href: '#', onClick: 'navbar.openAuthenticationModal()'},
        ]
    },
    methods: {
        openAuthenticationModal: function () {
            $('#auth-modal').modal();
        },
        toggleSidebar: function(){
            if(vueResourceList != undefined)
                vueResourceList.sidebarIsOpen = !vueResourceList.sidebarIsOpen; 
        },
    }
})