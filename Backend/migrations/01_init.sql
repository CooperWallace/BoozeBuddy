-- +goose Up
-- SQL in this section is executed when the migration is applied.

CREATE TABLE store (
	id integer primary key,
	name text,
	address text
);

CREATE TABLE user (
    id integer primary key,
    username text,
    password text
);

CREATE TABLE item (
	id integer primary key,
	name text,
	price real
);

-- +goose Down
-- SQL in this section is executed when the migrations is rolled back.

DROP TABLE store;
