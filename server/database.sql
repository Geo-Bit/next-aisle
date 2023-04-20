CREATE DATABASE ez_list;

CREATE TABLE shopping_list(
    item_id SERIAL PRIMARY KEY,
    description VARCHAR(255)
);

CREATE TABLE purchase_history(
    item_id SERIAL PRIMARY KEY,
    description VARCHAR(255),
    ts TIMESTAMP
);