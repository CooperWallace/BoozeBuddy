-- +goose Up
-- SQL in this section is executed when the migration is applied.

CREATE TABLE store (
	id integer primary key,
	name text,
	address text
);

CREATE TABLE user (
    id integer primary key,
    username text unique,
    password text
);

CREATE TABLE item (
	id integer primary key,
	timestamp DATE DEFAULT (datetime('now','localtime')),
	name text,
	price real,
	userid integer,
	storeid integer
);

-- +goose Down
-- SQL in this section is executed when the migrations is rolled back.

DROP TABLE item;
DROP TABLE store;
DROP TABLE user;
