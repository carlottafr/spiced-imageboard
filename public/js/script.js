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
            heading: "Latest Images",
            // seen: true,
            images: [],
        },
        mounted: function () {
            console.log("This is 'this' outside axios: ", this);
            // check for images in the db that
            // I want to eventually render
            var self = this;
            axios.get("/images").then(function (response) {
                console.log("response from /images: ", response.data);
                // console.log("This is 'self' inside axios: ", self);
                // self.cities = response.data;
                self.images = response.data;
                // for (var i = 0; i < self.images.length; i++) {
                //     console.log("The image URLs: ", self.images.url);
                //     console.log("The image titles: ", self.images.titles);
                // }
            });
        },
        methods: {
            myFunction: function () {
                console.log("My function is running!");
            },
        },
    });
})();
