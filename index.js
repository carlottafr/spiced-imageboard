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

// create a nicer look for dates and times

const showTime = (posttime) => {
    return (posttime = new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
        // the following makes no sense, but it is what it is
        // took quite some rounds of testing
        timeZone: "Etc/GMT",
    }).format(posttime));
};

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

// POST /get-more

app.post("/get-more", (req, res) => {
    return db
        .getMoreEntries(req.body.id)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("There is an error in db.getMoreEntries: ", err);
        });
});

// POST /upload

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
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
    let finalJson = [];
    const offset = (id) => {
        if (id > 1) {
            return id - 2;
        } else {
            return null;
        }
    };
    return db
        .getImage(req.body.id, offset(req.body.id))
        .then((result) => {
            result.rows[0].created_at = showTime(result.rows[0].created_at);
            if (result.rows[0].id === 1 && result.rows[0].prev_id === 1) {
                // set it to null at the first or rather last picture
                // so that the next arrow is hidden
                result.rows[0].prev_id = null;
            }
            finalJson.push(result.rows[0]);
        })
        .then(() => {
            return db.getComments(req.body.id).then((result) => {
                for (let i = 0; i < result.rows.length; i++) {
                    result.rows[i].created_at = showTime(
                        result.rows[i].created_at
                    );
                }
                finalJson.push(result.rows);
                res.json(finalJson);
            });
        })
        .catch((err) => {
            console.log("Error server POST /image-post: ", err);
        });
});

// POST /post-comment

app.post("/post-comment", (req, res) => {
    return db
        .addComment(req.body.poster, req.body.comment, req.body.image_id)
        .then((result) => {
            result.rows[0].created_at = showTime(result.rows[0].created_at);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("Error in POST /post-comment: ", err);
        });
});

app.listen(process.env.PORT || 8080, () => {
    console.log("Image Board server is at your service!");
});
