package main

import (
	// "fmt"
	"github.com/jmoiron/sqlx" //Library with DB interaction functions
	_ "github.com/lib/pq" //DB driver
)

type DataBase struct {
	*sqlx.DB
}

type Store struct {
	Id	int	`db:"id" json:"userID"`
}

func InitDB(connectionString string) (*DataBase, error) {
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
	query := `SELECT id FROM store`

	stores := []Store{}

	err := db.Select(&stores, query)
	if err != nil {
		return nil, err
	}
	return stores, nil
}
