DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS images CASCADE;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    op VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO images (url, op, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/61-s_gfV94j4xMBF58jI0vunCuaFkl55.jpg',
    'The Beatles',
    'Sgt. Peppers Lonely Hearts Club Band',
    'Rolling Stone Magazine never lies.'
);

INSERT INTO images (url, op, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/c3PCD-4h8EomqUemEkW2XiXbYPEOJegf.jpg',
    'Miles Davis',
    'Kind Of Blue',
    'A masterpiece for the ages.'
);

INSERT INTO images (url, op, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/WuznaJ4UlQ8DVwhoHgvhoW7W4XYi85_v.jpg',
    'Led Zeppelin',
    'Led Zeppelin',
    'Simply Led Zeppelin.'
);

INSERT INTO images (url, op, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/BIQS9cI7P9Z17R2h1lC6WrIGD1A4-gYh.jpg',
    'Nine Inch Nails',
    'The Fragile',
    'Crazy and ambitious Trent!'
);

INSERT INTO images (url, op, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/NY2Wex1fI8d4pz30n1X-mV2QG2T-4yRu.jpg',
    'Pink Floyd',
    'The Dark Side of the Moon',
    'This still hits deep!'
);

INSERT INTO images (url, op, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/OjxXU-EDEdaOH3iNjyG5N2XJXYDzViHh.jpg',
    'The Mars Volta',
    'Frances the Mute',
    'Wanna lose track of time and space for 77 minutes?'
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    poster VARCHAR NOT NULL,
    comment VARCHAR NOT NULL,
    image_id INTEGER NOT NULL REFERENCES images(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO comments (poster, comment, image_id) VALUES (
    'discoduck',
    'Too mainstream, Revolver is far superior!',
    1
);

INSERT INTO comments (poster, comment, image_id) VALUES (
    'funkychicken',
    'I always listen to this in the kitchen',
    2
);

INSERT INTO comments (poster, comment, image_id) VALUES (
    'funkychicken',
    'This always gets me dazed and confused, if you know what I mean 🍀💨',
    3
);

INSERT INTO comments (poster, comment, image_id) VALUES (
    'discoduck',
    'Zappa would have Led Zep for breakfast!',
    3
);