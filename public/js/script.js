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
                // console.log("response from /images: ", response.data);
                self.images = response.data;
            });
        },
        // methods: {
        //     myFunction: function () {
        //         console.log("My function is running!");
        //     },
        // },
    });
})();
