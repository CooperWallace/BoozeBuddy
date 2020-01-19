-- +goose Up
-- SQL in this section is executed when the migration is applied.

INSERT INTO store (name, address)
	VALUES ('Wine and Beyond Windermere', '6284 Currents Dr NW, Edmonton, AB T6W0L8'),
			('Wine and Beyond Southgate', '11011 51 Ave NW, Edmonton, AB T6H5T1');

INSERT INTO user (username, password)
	VALUES ('admin', '$2a$04$gJHL.4rNM17pCdYNyW3Q1.hs/TX5UAY4q5t2.4bscwaRt4gYgliky');


INSERT INTO item (name, price, userid, storeid)
	VALUES ('Innus and Guun', 20.32, 1, 1);

-- +goose Down
-- SQL in this section is executed when the migration is rolled back.

DELETE FROM store;
DELETE FROM user;
