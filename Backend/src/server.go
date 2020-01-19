package main

import (
	"fmt"
	"net/http"
	"encoding/json"
	"github.com/gorilla/mux" //DB interface library
)

// Simple wrapper struct to contain pointer to database for easy context access
type Wrapper struct {
	*DataBase
}

func (wrapper *Wrapper) getStores(w http.ResponseWriter, r *http.Request) {
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
	subRouter.HandleFunc("/registration", wrapper.handleRegistration).Methods("POST")

	// Listen and serve server on port 8080
	http.ListenAndServe(":8080", router)
}
