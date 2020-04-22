const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("public"));

// let cities = [
//     { name: "Berlin", country: "DE" },
//     { name: "Sheffield", country: "UK" },
//     { name: "Tokyo", country: "Japan" },
// ];

app.get("/images", (req, res) => {
    // console.log("GET /cities is active.");
    // res.json(cities);
    return db
        .getBasicEntries()
        .then((result) => {
            console.log("The db result: ", result.rows);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("There is an error in db.getBasicEntries: ", err);
        });
});

app.listen(8080, () => {
    console.log("Image Board server is at your service!");
});
