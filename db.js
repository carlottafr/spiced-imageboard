const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getEntries = () => {
    return db.query(`SELECT * FROM images ORDER BY created_at DESC;`);
};

module.exports.insertEntry = (url, username, title, description) => {
    return db.query(
        `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *;`,
        [url, username, title, description]
    );
};

module.exports.imagePost = (id) => {
    return db.query(
        `SELECT images.url AS url, images.op AS op, images.title AS title, images.description AS description, images.created_at AS optime, comments.poster AS poster, comments.comment AS comment, comments.created_at AS postertime 
        FROM images 
        LEFT JOIN comments 
        ON images.id = comments.image_id 
        WHERE images.id = $1;`,
        [id]
    );
};
