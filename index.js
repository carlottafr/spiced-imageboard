const express = require("express");
const app = express();
const db = require("./db");
const s3 = require("./s3");
const config = require("./config");

app.use(express.static("public"));

app.use(express.json());

// Image upload boilerplate start v
// will upload sent files to my
// hard drive in a folder called /uploads

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

// ^ Image upload boilerplate end

// GET /images

app.get("/images", (req, res) => {
    return db
        .getEntries()
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("There is an error in db.getEntries: ", err);
        });
});

// POST /upload

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // console.log("File: ", req.file);
    // console.log("Input: ", req.body);
    let awsUrl = config.s3Url;
    awsUrl += req.file.filename;
    req.body.url = awsUrl;

    if (req.file) {
        return db
            .insertEntry(
                req.body.url,
                req.body.op,
                req.body.title,
                req.body.description
            )
            .then((result) => {
                res.json(result.rows);
            });
    } else {
        res.json({
            success: false,
        });
    }
});

// GET /image-post

app.post("/image-post", (req, res) => {
    console.log("The req.body: ", req.body);
    let finalJson = [];
    return db
        .getImage(req.body.id)
        .then((result) => {
            console.log("This is the getImage result: ", result.rows);
            finalJson.push(result.rows[0]);
            console.log("finalJson stage 1: ", finalJson);
        })
        .then(() => {
            return db.getComments(req.body.id).then((result) => {
                console.log("This is the getComments result: ", result.rows);
                finalJson.push(result.rows);
                console.log("finalJson stage 2: ", finalJson);
                res.json(finalJson);
            });
        })
        .catch((err) => {
            console.log("Error server POST /image-post: ", err);
        });
});

app.listen(8080, () => {
    console.log("Image Board server is at your service!");
});
