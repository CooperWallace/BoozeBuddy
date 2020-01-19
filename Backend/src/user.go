package main

type User struct {
    ID       uuid.UUID `json: "id" db:"id"`
    Username string    `json: "username" db:"username"`
    Password string    `json: "password" db:"password"`
}

func (w *Wrapper) handleRegistration (w http.ResponseWriter, r *http.Request) {
	RegistrationBody := User{}
	err := json.NewDecoder(r.Body).Decode(&RegistrationBody)

	if err != nil {
		http.Error(w, "Error decoding JSON for login route", http.StatusBadRequest)
		return
	}

	HashPass := hashAndSalt(RegistrationBody.Password)

	err = Wrapper.CreateUser(RegistrationBody.Username, HashPass)

	return
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