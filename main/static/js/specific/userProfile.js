var userProfile = new Vue({
    el: "#user-profile",
    delimiters: ['[[', ']]'],

    data: {
        user: authenticatedUser, 
        profile: profile, 
    }
})