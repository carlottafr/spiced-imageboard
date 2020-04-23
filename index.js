const express = require("express");
const app = express();
const db = require("./db");
const s3 = require("./s3");
const config = require("./config");

app.use(express.static("public"));

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

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("File: ", req.file);
    console.log("Input: ", req.body);
    let awsUrl = config.s3Url;
    awsUrl += req.file.filename;
    req.body.url = awsUrl;

    if (req.file) {
        return db
            .insertEntry(
                req.body.url,
                req.body.username,
                req.body.title,
                req.body.description
            )
            .then((id) => {
                if (id) {
                    res.json(req.body);
                } else {
                    res.sendStatus(500);
                }
            });
    } else {
        res.json({
            success: false,
        });
    }
});

app.listen(8080, () => {
    console.log("Image Board server is at your service!");
});
