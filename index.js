const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("public"));

app.get("/images", (req, res) => {
    return db
        .getBasicEntries()
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("There is an error in db.getBasicEntries: ", err);
        });
});

app.listen(8080, () => {
    console.log("Image Board server is at your service!");
});
