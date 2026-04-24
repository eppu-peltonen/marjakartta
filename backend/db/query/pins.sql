-- name: ListPins :many
SELECT id, user_id, lat, lng, berry_type, notes, created_at, updated_at
FROM berry_pins
ORDER BY created_at DESC;

-- name: GetPin :one
SELECT id, user_id, lat, lng, berry_type, notes, created_at, updated_at
FROM berry_pins
WHERE id = ?;

-- name: CreatePin :one
INSERT INTO berry_pins (id, user_id, lat, lng, berry_type, notes)
VALUES (?, ?, ?, ?, ?, ?)
RETURNING id, user_id, lat, lng, berry_type, notes, created_at, updated_at;

-- name: UpdatePin :one
UPDATE berry_pins
SET notes = ?, berry_type = ?, updated_at = datetime('now')
WHERE id = ? AND user_id = ?
RETURNING id, user_id, lat, lng, berry_type, notes, created_at, updated_at;

-- name: DeletePin :exec
DELETE FROM berry_pins
WHERE id = ? AND user_id = ?;
