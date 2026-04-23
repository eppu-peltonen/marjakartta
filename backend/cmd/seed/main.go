package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"marjakartta/internal/config"
	"marjakartta/internal/db/sqlc"

	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	if len(os.Args) < 3 {
		fmt.Fprintf(os.Stderr, "usage: seed <username> <password>\n")
		os.Exit(1)
	}
	username := os.Args[1]
	password := os.Args[2]

	cfg := config.Load()

	pool, err := pgxpool.New(context.Background(), cfg.DBSource)
	if err != nil {
		log.Fatalf("cannot connect to db: %v", err)
	}
	defer pool.Close()

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("cannot hash password: %v", err)
	}

	queries := sqlc.New(pool)
	user, err := queries.CreateUser(context.Background(), sqlc.CreateUserParams{
		Username:     username,
		PasswordHash: string(hash),
	})
	if err != nil {
		log.Fatalf("cannot create user: %v", err)
	}

	fmt.Printf("created user: id=%s username=%s\n", user.ID, user.Username)
}
