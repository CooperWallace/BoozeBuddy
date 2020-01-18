-- +goose Up
-- SQL in this section is executed when the migration is applied.

CREATE TABLE store (
	id integer primary key,
	name text,
	address text,
);

-- +goose Down
-- SQL in this section is executed when the migrations is rolled back.

DROP TABLE store;
