CREATE DATABASE ez_list;

CREATE TABLE shopping_list(
    item_id SERIAL PRIMARY KEY,
    description VARCHAR(255)
);