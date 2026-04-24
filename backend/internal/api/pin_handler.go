package api

import (
	"database/sql"
	"errors"
	"net/http"

	"marjakartta/internal/auth"
	"marjakartta/internal/db/sqlc"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type PinHandler struct {
	queries *sqlc.Queries
}

func NewPinHandler(q *sqlc.Queries) *PinHandler {
	return &PinHandler{queries: q}
}

type pinResponse struct {
	ID        string  `json:"id"`
	Lat       float64 `json:"lat"`
	Lng       float64 `json:"lng"`
	BerryType string  `json:"berryType"`
	Notes     string  `json:"notes"`
	CreatedAt string  `json:"createdAt"`
	UpdatedAt string  `json:"updatedAt"`
}

func toPinResponse(p sqlc.BerryPin) pinResponse {
	return pinResponse{
		ID:        p.ID,
		Lat:       p.Lat,
		Lng:       p.Lng,
		BerryType: p.BerryType,
		Notes:     p.Notes,
		CreatedAt: p.CreatedAt,
		UpdatedAt: p.UpdatedAt,
	}
}

type createPinRequest struct {
	Lat       float64 `json:"lat" binding:"min=-90,max=90"`
	Lng       float64 `json:"lng" binding:"min=-180,max=180"`
	BerryType string  `json:"berryType" binding:"required,oneof=blueberry lingonberry"`
	Notes     string  `json:"notes"`
}

type updatePinRequest struct {
	Notes     *string `json:"notes"`
	BerryType *string `json:"berryType" binding:"omitempty,oneof=blueberry lingonberry"`
}

func (h *PinHandler) List(c *gin.Context) {
	pins, err := h.queries.ListPins(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "internal error"})
		return
	}

	resp := make([]pinResponse, 0, len(pins))
	for _, p := range pins {
		resp = append(resp, toPinResponse(p))
	}
	c.JSON(http.StatusOK, resp)
}

func (h *PinHandler) Get(c *gin.Context) {
	id := c.Param("id")
	if _, err := uuid.Parse(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid pin id"})
		return
	}

	pin, err := h.queries.GetPin(c, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"message": "pin not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": "internal error"})
		return
	}

	c.JSON(http.StatusOK, toPinResponse(pin))
}

func (h *PinHandler) Create(c *gin.Context) {
	var req createPinRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid request"})
		return
	}

	claims := c.MustGet(authPayloadKey).(*auth.Claims)

	pin, err := h.queries.CreatePin(c, sqlc.CreatePinParams{
		ID:        uuid.New().String(),
		UserID:    claims.UserID,
		Lat:       req.Lat,
		Lng:       req.Lng,
		BerryType: req.BerryType,
		Notes:     req.Notes,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "internal error"})
		return
	}

	c.JSON(http.StatusCreated, toPinResponse(pin))
}

func (h *PinHandler) Update(c *gin.Context) {
	id := c.Param("id")
	if _, err := uuid.Parse(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid pin id"})
		return
	}

	var req updatePinRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid request"})
		return
	}

	claims := c.MustGet(authPayloadKey).(*auth.Claims)

	existing, err := h.queries.GetPin(c, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{"message": "pin not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": "internal error"})
		return
	}

	if existing.UserID != claims.UserID {
		c.JSON(http.StatusForbidden, gin.H{"message": "not your pin"})
		return
	}

	notes := existing.Notes
	if req.Notes != nil {
		notes = *req.Notes
	}
	berryType := existing.BerryType
	if req.BerryType != nil {
		berryType = *req.BerryType
	}

	pin, err := h.queries.UpdatePin(c, sqlc.UpdatePinParams{
		Notes:     notes,
		BerryType: berryType,
		ID:        id,
		UserID:    claims.UserID,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "internal error"})
		return
	}

	c.JSON(http.StatusOK, toPinResponse(pin))
}

func (h *PinHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	if _, err := uuid.Parse(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid pin id"})
		return
	}

	claims := c.MustGet(authPayloadKey).(*auth.Claims)

	err := h.queries.DeletePin(c, sqlc.DeletePinParams{
		ID:     id,
		UserID: claims.UserID,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "internal error"})
		return
	}

	c.Status(http.StatusNoContent)
}
