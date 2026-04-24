package api

import (
	"database/sql"
	"errors"
	"net/http"
	"time"

	"marjakartta/internal/auth"
	"marjakartta/internal/db/sqlc"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	queries    *sqlc.Queries
	tokenMaker *auth.TokenMaker
}

func NewAuthHandler(q *sqlc.Queries, tm *auth.TokenMaker) *AuthHandler {
	return &AuthHandler{queries: q, tokenMaker: tm}
}

type loginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type userResponse struct {
	ID       string `json:"id"`
	Username string `json:"username"`
}

type authResponse struct {
	User  userResponse `json:"user"`
	Token string       `json:"token"`
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "username and password are required"})
		return
	}

	user, err := h.queries.GetUserByUsername(c, req.Username)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "invalid credentials"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": "internal error"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "invalid credentials"})
		return
	}

	token, err := h.tokenMaker.CreateToken(user.ID, user.Username, 24*time.Hour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "internal error"})
		return
	}

	c.JSON(http.StatusOK, authResponse{
		User: userResponse{
			ID:       user.ID,
			Username: user.Username,
		},
		Token: token,
	})
}

func (h *AuthHandler) Me(c *gin.Context) {
	claims := c.MustGet(authPayloadKey).(*auth.Claims)

	token, err := h.tokenMaker.CreateToken(claims.UserID, claims.Username, 24*time.Hour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "internal error"})
		return
	}

	c.JSON(http.StatusOK, authResponse{
		User: userResponse{
			ID:       claims.UserID,
			Username: claims.Username,
		},
		Token: token,
	})
}
