-- name: ListPins :many
SELECT id, user_id, lat, lng, berry_type, notes, created_at, updated_at
FROM berry_pins
ORDER BY created_at DESC;

-- name: GetPin :one
SELECT id, user_id, lat, lng, berry_type, notes, created_at, updated_at
FROM berry_pins
WHERE id = $1;

-- name: CreatePin :one
INSERT INTO berry_pins (user_id, lat, lng, berry_type, notes)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, user_id, lat, lng, berry_type, notes, created_at, updated_at;

-- name: UpdatePin :one
UPDATE berry_pins
SET notes = $2, berry_type = $3, updated_at = now()
WHERE id = $1 AND user_id = $4
RETURNING id, user_id, lat, lng, berry_type, notes, created_at, updated_at;

-- name: DeletePin :exec
DELETE FROM berry_pins
WHERE id = $1 AND user_id = $2;
