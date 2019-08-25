var profile = new Vue({
    el: "#profile",
    delimiters: ['[[', ']]'],

    data: {
        authenticatedUser: authenticatedUser,
        info: profileInfo,

        isEditing: false,
        newInfo: {}
    },
    methods: {
        startEditing: function () {
            this.isEditing = true;

            this.newInfo.fullname = this.info.fullname;
            this.newInfo.website = this.info.website;
            this.newInfo.bio = this.info.bio;
        },
        saveEditing: function () {
       
            var postData = {
                csrfmiddlewaretoken: csrfmiddlewaretoken,
                jsInfo: JSON.stringify(this.newInfo)
            };
            $.post(urls.updateProfile(this.info.user),
                postData)
                .done(function (response) {

                    console.log(response)
                    profile.info.fullname = profile.newInfo.fullname;
                    profile.info.website = profile.newInfo.website;
                    profile.info.bio = profile.newInfo.bio;
                })
                .always(function () {
                    profile.isEditing = false;
                })
        }
    }
})