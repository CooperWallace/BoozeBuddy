package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux" //DB interface library
	"golang.org/x/crypto/bcrypt"
)

// Simple wrapper struct to contain pointer to database for easy context access
type Wrapper struct {
	*DataBase
}

// Create the JWT key used to create the signature
var jwtKey = []byte("secretkey")

// Create a struct that will be encoded to a JWT.
// We add jwt.StandardClaims as an embedded type, to provide fields like expiry time
type Claims struct {
	UserID   int    `json:"userid"`
	Username string `json:"username"`
	jwt.StandardClaims
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

func (wrapper *Wrapper) authenticateMW(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		jwtString := r.Header.Get("Authorization")

		if len(jwtString) < 1 {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		claims := &Claims{}

		tkn, err := jwt.ParseWithClaims(jwtString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
				return
			} else {
				http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
				return
			}
		}
		if !tkn.Valid {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		} else {
			next.ServeHTTP(w, r)
		}
	})
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
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("content-type", "application/json")

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
		hashPass := hashAndSalt(bytePass)

		err = wrapper.CreateUser(reqBody.Username, hashPass)

		if err != nil {
			panic(err)
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}
}

func (wrapper *Wrapper) handleLogin(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	reqBody := User{}
	err := json.NewDecoder(r.Body).Decode(&reqBody)

	if err != nil {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	//Check if login credentials are valid
	user, err := wrapper.LookupUser(reqBody.Username)

	if err != nil && err != sql.ErrNoRows {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
		// Case if user with given username does not exist
	} else if err == sql.ErrNoRows {
		//login invalid
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
	} else {
		if comparePasswords(user.Password, []byte(reqBody.Password)) {
			//login valid, create and return JWT to client
			expirationTime := time.Now().Add(60 * time.Minute)
			claims := &Claims{
				UserID:   user.Id,
				Username: user.Username,
				StandardClaims: jwt.StandardClaims{
					ExpiresAt: expirationTime.Unix(),
				},
			}

			// Declare the token with the algorithm used for signing, and the claims
			token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
			// Create the JWT string
			tokenString, err := token.SignedString(jwtKey)
			if err != nil {
				// If there is an error in creating the JWT return an internal server error
				http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
				return
			}

			respBody := "{\"jwt\": \"" + tokenString + "\"}"
			fmt.Fprintf(w, respBody)

		} else {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		}
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

// func (wrapper *Wrapper) addStoreItems(w http.ResponseWriter, r *http.Request) {

// 	w.Header().Set("Access-Control-Allow-Origin", "*")
// 	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

// 	byteResp, err := ioutil.ReadAll(r.Body)
// 	if err != nil {
// 		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
// 		return
// 	}
// 	// Decode the JSON Data into a usable variable
// 	item := Item{}
// 	if err := json.Unmarshal(byteResp, &item); err != nil {
// 		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
// 		return
// 	}

// 	err = wrapper.AddStoreItems(item)

// 	if err != nil {
// 		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
// 	}
// }

func (wrapper *Wrapper) addStoreItems(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// need : name category price userid and storeid
	reqVars := mux.Vars(r)
	storeID, err := strconv.Atoi(reqVars["storeid"])
	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	reqBodyValues := Item{}
	err = json.NewDecoder(r.Body).Decode(&reqBodyValues)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	// todo: get username and then userID from jwt claims struct
	jwtString := r.Header.Get("Authorization")

	if len(jwtString) < 1 {
		http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
		return
	}

	claims := &Claims{}

	_, err = jwt.ParseWithClaims(jwtString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	err = wrapper.AddStoreItems(reqBodyValues.Name, reqBodyValues.Category, reqBodyValues.Price, claims.UserID, storeID)

	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
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

	// Handle CORS
	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	origins := handlers.AllowedOrigins([]string{"*"})

	// Create wrapper struct containing pointer to DB
	wrapper := Wrapper{db}

	router.HandleFunc("/register", wrapper.handleRegistration).Methods("POST")
	router.HandleFunc("/login", wrapper.handleLogin).Methods("POST")

	// Associate routes with handler functions
	openSubRouter := router.PathPrefix("/api").Subrouter()
	openSubRouter.HandleFunc("/stores", wrapper.getStores).Methods("GET")
	openSubRouter.HandleFunc("/stores", wrapper.addStore).Methods("POST")
	openSubRouter.HandleFunc("/stores/{storeid:[0-9]+}", wrapper.getStoreDetails).Methods("GET")
	openSubRouter.HandleFunc("/stores/{storeid:[0-9]+}/items", wrapper.getStoreItems).Methods("GET")

	secureSubRouter := router.PathPrefix("/api").Subrouter()
	secureSubRouter.HandleFunc("/stores/{storeid:[0-9]+}/items", wrapper.addStoreItems).Methods("POST")
	secureSubRouter.Use(wrapper.authenticateMW)

	// Listen and serve server on port 8080
	http.ListenAndServe(":8080", handlers.CORS(headers, methods, origins)(router))
}
