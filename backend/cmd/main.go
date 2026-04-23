package main

import (
	"context"
	"log"

	"marjakartta/internal/api"
	"marjakartta/internal/auth"
	"marjakartta/internal/config"
	"marjakartta/internal/db/sqlc"

	"github.com/jackc/pgx/v5/pgxpool"
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

	pool, err := pgxpool.New(context.Background(), cfg.DBSource)
	if err != nil {
		log.Fatalf("cannot connect to db: %v", err)
	}
	defer pool.Close()

	queries := sqlc.New(pool)

	router := api.NewRouter(queries, tokenMaker)

	log.Printf("starting server on %s", cfg.ServerAddress)
	if err := router.Run(cfg.ServerAddress); err != nil {
		log.Fatalf("cannot start server: %v", err)
	}
}
