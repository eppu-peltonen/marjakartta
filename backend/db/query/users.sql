-- name: CreateUser :one
INSERT INTO users (id, username, password_hash)
VALUES (?, ?, ?)
RETURNING id, username, password_hash, created_at;

-- name: GetUserByUsername :one
SELECT id, username, password_hash, created_at
FROM users
WHERE username = ?;

-- name: GetUserByID :one
SELECT id, username, created_at
FROM users
WHERE id = ?;
