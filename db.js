const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getEntries = () => {
    return db.query(`SELECT * FROM images ORDER BY id DESC LIMIT 12;`);
};

module.exports.getMoreEntries = (id) => {
    return db.query(
        `SELECT *, (
            SELECT id FROM images ORDER BY id ASC LIMIT 1
        ) AS lowest_id FROM images WHERE id < $1 ORDER BY id DESC LIMIT 12;`,
        [id]
    );
};

module.exports.insertEntry = (url, op, title, description) => {
    return db.query(
        `INSERT INTO images (url, op, title, description) VALUES ($1, $2, $3, $4) RETURNING *;`,
        [url, op, title, description]
    );
};

module.exports.getImage = (id, offset) => {
    return db.query(
        `SELECT *, (
        SELECT id FROM images LIMIT 1 OFFSET $1
    ) AS next_id, (
        SELECT id FROM images LIMIT 1 OFFSET $2
    ) AS prev_id FROM images WHERE id = $1;`,
        [id, offset]
    );
};

module.exports.getComments = (id) => {
    return db.query(
        `SELECT * FROM comments WHERE image_id = $1 ORDER BY id DESC;`,
        [id]
    );
};

module.exports.addComment = (poster, comment, image_id) => {
    return db.query(
        `INSERT INTO comments (poster, comment, image_id) VALUES ($1, $2, $3) RETURNING *;`,
        [poster, comment, image_id]
    );
};
