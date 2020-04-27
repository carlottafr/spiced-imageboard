(function () {
    Vue.component("modal-component", {
        template: "#commentModal",
        props: ["id"],
        mounted: function () {
            this.showModal();
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
            };
        },
        watch: {
            id: function () {
                // console.log("id changed as noticed the watcher.");
                this.showModal();
            },
        },
        methods: {
            showModal: function () {
                var self = this;
                // make a request to server sending the id
                // ask for all the information about the id
                axios
                    .post("/image-post", { id: this.id })
                    .then(function (response) {
                        self.image = response.data.shift();
                        self.comments = response.data[0];
                    })
                    .catch(function (err) {
                        console.log("Error in POST /image-post: ", err);
                    });
            },
            closeModal: function () {
                // console.log("I am emitting a msg to the vue instance");
                this.$emit("close"); // is used in @close
            },
            postComment: function (e) {
                e.preventDefault();
                var self = this;
                var comment = {
                    poster: this.poster,
                    comment: this.comment,
                    image_id: this.id,
                };
                axios.post("/post-comment", comment).then(function (response) {
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
            // gives me the value after the # in the URL
            // images can now be shared
            selectedImage: location.hash.slice(1),
            images: [],
            title: "",
            description: "",
            op: "",
            file: null,
            moreAlbums: true,
        },
        mounted: function () {
            // check for images in the db that
            // I want to eventually render
            var self = this;
            axios.get("/images").then(function (response) {
                self.images = response.data;
            });

            window.addEventListener("hashchange", function () {
                // opens the modal
                self.selectedImage = location.hash.slice(1);
            });
        },
        methods: {
            closeMe: function () {
                console.log("Vue got the emitted message!");
                // closes the modal
                this.selectedImage = null;
                location.hash = "";
            },
            handleClick: function (e) {
                e.preventDefault();
                var self = this;
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("op", this.op);
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
                this.file = e.target.files[0];
            },
            getMore: function () {
                console.log(
                    "This is the last image ID: ",
                    this.images[this.images.length - 1].id
                );
                var lastId = { id: this.images[this.images.length - 1].id };
                var self = this;
                axios
                    .post("/get-more", lastId)
                    .then(function (response) {
                        var lowestId =
                            response.data[response.data.length - 1].lowest_id;
                        var lastId = response.data[response.data.length - 1].id;
                        if (lastId === lowestId) {
                            self.moreAlbums = false;
                        }
                        self.images.push(...response.data);
                    })
                    .catch(function (err) {
                        console.log("Error in POST /get-more: ", err);
                    });
            },
        },
    });
})();
