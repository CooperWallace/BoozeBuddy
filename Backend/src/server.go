package main

import (
	"fmt"
	"net/http"
	"encoding/json"
	"github.com/gorilla/mux" //DB interface library
	"golang.org/x/crypto/bcrypt"
	"log"
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

func (wrapper *Wrapper) handleRegistration (w http.ResponseWriter, r *http.Request) {
	RegistrationBody := User{}
	err := json.NewDecoder(r.Body).Decode(&RegistrationBody)

	if err != nil {
		http.Error(w, "Error decoding JSON for login route", http.StatusBadRequest)
		return
	}

	bytePass := []byte(RegistrationBody.Password)
	HashPass := hashAndSalt(bytePass)

	err = wrapper.CreateUser(RegistrationBody.Username, HashPass)

	return
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

	// Associate routes with handler functions
	subRouter := router.PathPrefix("/api").Subrouter()
	subRouter.HandleFunc("/stores", wrapper.getStores).Methods("GET")
	subRouter.HandleFunc("/stores", wrapper.addStore).Methods("POST")
	subRouter.HandleFunc("/registration", wrapper.handleRegistration).Methods("POST")

	// Listen and serve server on port 8080
	http.ListenAndServe(":8080", router)
}
