package main

import (
	"github.com/jmoiron/sqlx" //Library with DB interaction functions
	_ "github.com/lib/pq"     //DB driver
	_ "github.com/mattn/go-sqlite3"
)

type DataBase struct {
	*sqlx.DB
}

type Store struct {
	Id      int    `db:"id" json:"storeID"`
	Name    string `db:"name"	json: "name"`
	Address string `db:"address" json:"address"`
}

type User struct {
	Id       int    `db:"id" json:"id""`
	Username string `db:"username" json:"username"`
	Password string `db:"password" json:"password"`
}

type Item struct {
	Id        int     `db:"id" json:"id""`
	Timestamp string  `db:"timestamp" json:"timestamp""`
	Name      string  `db:"name" json:"name""`
	Price     float64 `db:"price" json:"price""`
	Userid    int     `db:"userid" json:"userid""`
	Storeid   int     `db:"storeid" json:"storeid""`
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

func (db *DataBase) GetStoreDetails(storeID int) (Store, error) {
	query := `SELECT * FROM store WHERE id = $1`

	store := Store{}

	err := db.Get(&store, query, storeID)
	if err != nil {
		return Store{}, err
	}
	return store, nil
}

func (db *DataBase) AddStore(name string, address string) error {

	insertCmd := `INSERT INTO store (name, address) VALUES ($1, $2)`

	_, err := db.Exec(insertCmd, name, address)
	return err
}

func (db *DataBase) CreateUser(username string, password string) error {

	insertCmd := `INSERT INTO user (username, password)
                        VALUES ($1, $2)`

	_, err := db.Exec(insertCmd, username, password)
	return err
}

func (db *DataBase) LookupUser(username string) (User, error) {
	query := `SELECT * FROM user WHERE username = $1`

	user := User{}

	err := db.Get(&user, query, username)
	if err != nil {
		return User{}, err
	}
	return user, nil
}

func (db *DataBase) GetStoreItems(storeID int) ([]Item, error) {
	query := `SELECT * FROM item WHERE storeid = $1`

	items := []Item{}

	err := db.Select(&items, query, storeID)
	if err != nil {
		return nil, err
	}
	return items, nil
}
