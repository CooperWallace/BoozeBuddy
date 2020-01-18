-- +goose Up
-- SQL in this section is executed when the migration is applied.

INSERT INTO store (name, address)
	VALUES ('Wine and Beyond Windermere', '6284 Currents Dr NW, Edmonton, AB T6W0L8'),
			('Wine and Beyond Southgate', '11011 51 Ave NW, Edmonton, AB T6H5T1');

-- +goose Down
-- SQL in this section is executed when the migration is rolled back.

DELETE FROM store;