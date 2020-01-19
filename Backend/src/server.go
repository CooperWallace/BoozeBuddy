package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux" //DB interface library
	"golang.org/x/crypto/bcrypt"
)

// Simple wrapper struct to contain pointer to database for easy context access
type Wrapper struct {
	*DataBase
}

//Following 2 functions used from https://medium.com/@jcox250/password-hash-salt-using-golang-b041dc94cb72 on hashing passwords properly
func hashAndSalt(pwd []byte) string {

	// Use GenerateFromPassword to hash & salt pwd
	// MinCost is just an integer constant provided by the bcrypt
	// package along with DefaultCost & MaxCost.
	// The cost can be any value you want provided it isn't lower
	// than the MinCost (4)
	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {
		log.Println(err)
	}
	// GenerateFromPassword returns a byte slice so we need to
	// convert the bytes to a string and return it
	return string(hash)
}

func comparePasswords(hashedPwd string, plainPwd []byte) bool {
	// Since we'll be getting the hashed password from the DB it
	// will be a string so we'll need to convert it to a byte slice
	byteHash := []byte(hashedPwd)
	err := bcrypt.CompareHashAndPassword(byteHash, plainPwd)
	if err != nil {
		log.Println(err)
		return false
	}

	return true
}

func (wrapper *Wrapper) getStores(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Call GetStores (located in database.go)
	stores, err := wrapper.GetStores()

	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// Encode data to JSON and write to response writer
	err = json.NewEncoder(w).Encode(stores)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}

func (wrapper *Wrapper) getStoreDetails(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	reqVars := mux.Vars(r)
	storeID, err := strconv.Atoi(reqVars["storeid"])

	store, err := wrapper.GetStoreDetails(storeID)

	if err != nil && err != sql.ErrNoRows {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(store)
}

func (wrapper *Wrapper) addStore(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	reqBodyValues := Store{}

	err := json.NewDecoder(r.Body).Decode(&reqBodyValues)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	err = wrapper.AddStore(reqBodyValues.Name, reqBodyValues.Address)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}

func (wrapper *Wrapper) handleRegistration(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	reqBody := User{}
	err := json.NewDecoder(r.Body).Decode(&reqBody)

	if err != nil {
		http.Error(w, "Error decoding JSON for login route", http.StatusBadRequest)
		return
	}

	// Check if username is already taken first
	_, err = wrapper.LookupUser(reqBody.Username)
	if err != nil && err != sql.ErrNoRows {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	// If there already is a user with this name in database
	if err != sql.ErrNoRows {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
		// Else, create user
	} else {
		bytePass := []byte(reqBody.Password)
		HashPass := hashAndSalt(bytePass)

		err = wrapper.CreateUser(reqBody.Username, HashPass)
	}
}

func (wrapper *Wrapper) getStoreItems(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	reqVars := mux.Vars(r)
	storeID, err := strconv.Atoi(reqVars["storeid"])

	item, err := wrapper.GetStoreItems(storeID)

	if err != nil && err != sql.ErrNoRows {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(item)
}

func main() {
	// Call InitDB function in database.go to retrieve pointer to DB
	db, err := InitDB()
	if err != nil {
		fmt.Printf("Error initializing database: %v\n", err)
		return
	}

	// Close database automatically upon termination of service
	defer db.Close()

	// Initialize gorilla/mux router
	router := mux.NewRouter()

	// Create wrapper struct containing pointer to DB
	wrapper := Wrapper{db}

	router.HandleFunc("/register", wrapper.handleRegistration).Methods("POST")
	// Associate routes with handler functions
	subRouter := router.PathPrefix("/api").Subrouter()
	subRouter.HandleFunc("/stores", wrapper.getStores).Methods("GET")
	subRouter.HandleFunc("/stores", wrapper.addStore).Methods("POST")
	subRouter.HandleFunc("/stores/{storeid:[0-9]+}", wrapper.getStoreDetails).Methods("GET")
	subRouter.HandleFunc("/stores/{storeid:[0-9]+}/items", wrapper.getStoreItems).Methods("GET")

	// Listen and serve server on port 8080
	http.ListenAndServe(":8080", router)
}
