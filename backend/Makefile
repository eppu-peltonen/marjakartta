-include .env
export

.PHONY: sqlc migrate-up migrate-down seed server build

build:
	go build -o bin/server ./cmd/server
	go build -o bin/seed ./cmd/seed

server:
	go run ./cmd

seed:
	go run ./cmd/seed $(USER) $(PASS)

sqlc:
	sqlc generate

migrate-up:
	goose -dir db/migration postgres "$(DATABASE_URL)" up

migrate-down:
	goose -dir db/migration postgres "$(DATABASE_URL)" down

migrate-create:
	goose -dir db/migration create $(NAME) sql

tidy:
	go mod tidy
