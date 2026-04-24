package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"

	"marjakartta/internal/config"
	"marjakartta/internal/db/sqlc"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	_ "modernc.org/sqlite"
)

func main() {
	if len(os.Args) < 3 {
		fmt.Fprintf(os.Stderr, "usage: seed <username> <password>\n")
		os.Exit(1)
	}
	username := os.Args[1]
	password := os.Args[2]

	cfg := config.Load()

	db, err := sql.Open("sqlite", cfg.DBSource)
	if err != nil {
		log.Fatalf("cannot open db: %v", err)
	}
	defer db.Close()

	db.Exec("PRAGMA foreign_keys=ON")

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("cannot hash password: %v", err)
	}

	queries := sqlc.New(db)
	user, err := queries.CreateUser(context.Background(), sqlc.CreateUserParams{
		ID:           uuid.New().String(),
		Username:     username,
		PasswordHash: string(hash),
	})
	if err != nil {
		log.Fatalf("cannot create user: %v", err)
	}

	fmt.Printf("created user: id=%s username=%s\n", user.ID, user.Username)
}
