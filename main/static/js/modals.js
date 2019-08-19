var authModal = new Vue({
    delimiters: ['[[', ']]'],
    el: '#auth-modal',
    data: {

    },
    methods: {
        signUp: function () {
            var signupData = $('#signup-form').serialize();
            
            $.post(urls.createUser, signupData, function (resultData) {
                if (resultData.errors) {
                    for (var error in resultData.errors) {
                        console.log(resultData.errors[error]);
                    }
                }
                else
                    location.reload();
            }, "json");
        }
    }
});