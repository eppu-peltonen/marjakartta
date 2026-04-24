package main

import (
	"database/sql"
	"log"

	"marjakartta/internal/api"
	"marjakartta/internal/auth"
	"marjakartta/internal/config"
	"marjakartta/internal/db/sqlc"

	_ "modernc.org/sqlite"
)

func main() {
	cfg := config.Load()

	if cfg.JWTSecret == "" {
		log.Fatal("JWT_SECRET environment variable is required")
	}

	tokenMaker, err := auth.NewTokenMaker(cfg.JWTSecret)
	if err != nil {
		log.Fatalf("cannot create token maker: %v", err)
	}

	db, err := sql.Open("sqlite", cfg.DBSource)
	if err != nil {
		log.Fatalf("cannot open db: %v", err)
	}
	defer db.Close()

	db.Exec("PRAGMA journal_mode=WAL")
	db.Exec("PRAGMA foreign_keys=ON")

	queries := sqlc.New(db)

	router := api.NewRouter(queries, tokenMaker)

	log.Printf("starting server on %s", cfg.ServerAddress)
	if err := router.Run(cfg.ServerAddress); err != nil {
		log.Fatalf("cannot start server: %v", err)
	}
}
