(function () {
    Vue.component("modal-component", {
        template: "#commentModal",
        props: ["id"],
        mounted: function () {
            var self = this;
            console.log("postTitle: ", this.postTitle);
            console.log("ID in mounted of components: ", this.id);
            // make a request to server sending the id
            // ask for all the information about the id
            axios
                .post("/image-post", { id: this.id })
                .then(function (response) {
                    console.log("This is the response data: ", response.data);
                    self.image = response.data.shift();
                    self.comments = response.data[0];
                    console.log("These are the comments: ", response.data[0]);
                })
                .catch(function (err) {
                    console.log("Error in POST /image-post: ", err);
                });
        },
        data: function () {
            return {
                image: {
                    url: "",
                    title: "",
                    description: "",
                    op: "",
                    optime: "",
                    poster: "",
                    comment: "",
                    postertime: "",
                },
                comments: [],
                poster: "",
                comment: "",
                created_at: "",
            };
        },
        methods: {
            closeModal: function () {
                console.log("I am emitting a msg to the vue instance");
                this.$emit("close"); // is used in @close
            },
            postComment: function (e) {
                e.preventDefault();
                console.log("Someone wants to post a comment.");
                var self = this;
                var comment = {
                    poster: this.poster,
                    comment: this.comment,
                    image_id: this.id,
                };
                console.log("This is the comment: ", comment);
                axios.post("/post-comment", comment).then(function (response) {
                    console.log(
                        "This is the response data from POST /post-comment: ",
                        response.data
                    );
                    self.comments.unshift(response.data[0]);
                });
            },
        },
    });
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
            selectedImage: null,
            images: [],
            title: "",
            description: "",
            op: "",
            file: null,
            fruits: [
                {
                    title: "🥝",
                    id: 1,
                },
                {
                    title: "🍓",
                    id: 2,
                },
                {
                    title: "🍋",
                    id: 3,
                },
            ],
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
            closeMe: function () {
                console.log("Vue got the emitted message!");
                // close the modal
                this.selectedImage = null;
            },
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
                formData.append("username", this.op);
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
