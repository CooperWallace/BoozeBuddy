package main

import (
	"github.com/jmoiron/sqlx" //Library with DB interaction functions
	_ "github.com/mattn/go-sqlite3"
	_ "github.com/lib/pq" //DB driver
)

type DataBase struct {
	*sqlx.DB
}

type Store struct {
	Id	int	`db:"id" json:"storeID"`
	Name	string	`db:"name"	json: "name"`
	Address string	`db:"address" json:"address"`
}

func InitDB() (*DataBase, error) {
	db := DataBase{}
	var err error
	db.DB, err = sqlx.Connect("sqlite3", "boozebuddy.db")
	if err != nil {
		return nil, err
	}
	// Return pointer to the DB
	return &db, nil
}

func (db *DataBase) GetStores() ([]Store, error) {
	query := `SELECT * FROM store`

	stores := []Store{}

	err := db.Select(&stores, query)
	if err != nil {
		return nil, err
	}
	return stores, nil
}

// This function takes a presenter's UID, an evaluators UID, a question ID, and an
// answer text and creates a new entry in the answers table with the fields specified
func (db *DataBase) CreateUser(username string, password string) error {

    insertCmd := `INSERT INTO user (username, password) 
                        VALUES ($1, $2)`

    _, err := db.Exec(insertCmd, username, password)
    return err
}