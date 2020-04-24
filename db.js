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

module.exports.getImage = (id) => {
    return db.query(`SELECT * FROM images WHERE id = $1;`, [id]);
};

module.exports.getComments = (id) => {
    return db.query(`SELECT * FROM comments WHERE image_id = $1;`, [id]);
};
