(function () {
    new Vue({
        // element -> el
        // which element in my html will have access
        // to my vue code
        el: "#main",
        // to data, I add any information that is
        // dynamic and might change that I will
        // render on screen
        // this data is 'reactive'
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
        },
        mounted: function () {
            // console.log("This is 'this' outside axios: ", this);
            // check for images in the db that
            // I want to eventually render
            var self = this;
            axios.get("/images").then(function (response) {
                // console.log("response from /images: ", response.data);
                self.images = response.data;
            });
        },
        methods: {
            handleClick: function (e) {
                e.preventDefault();
                // console.log(
                //     "Someone clicked on the button, that's what in it: ",
                //     this
                // );
                var self = this;
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                // ^ would be an empty object with console.log
                // but the key-value pairs are added anyway
                // v send info to the server
                axios
                    .post("/upload", formData)
                    .then(function (response) {
                        console.log(
                            "Response from POST /upload: ",
                            response.data
                        );
                        self.images.unshift(response.data[0]);
                    })
                    .catch(function (err) {
                        console.log("Error in POST /upload: ", err);
                    });
            },
            handleChange: function (e) {
                // console.log("handleChange is running");
                // console.log("File: ", e.target.files[0]);
                this.file = e.target.files[0];
            },
        },
    });
})();
