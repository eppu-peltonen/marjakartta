package api

import (
	"marjakartta/internal/auth"
	"marjakartta/internal/db/sqlc"

	"github.com/gin-gonic/gin"
)

func NewRouter(queries *sqlc.Queries, tokenMaker *auth.TokenMaker) *gin.Engine {
	router := gin.Default()
	router.Use(CORSMiddleware())

	authHandler := NewAuthHandler(queries, tokenMaker)
	pinHandler := NewPinHandler(queries)

	v := router.Group("/api")
	{
		authGroup := v.Group("/auth")
		{
			authGroup.POST("/login", authHandler.Login)
			authGroup.GET("/me", AuthMiddleware(tokenMaker), authHandler.Me)
		}

		pinGroup := v.Group("/pins")
		pinGroup.Use(AuthMiddleware(tokenMaker))
		{
			pinGroup.GET("", pinHandler.List)
			pinGroup.GET("/:id", pinHandler.Get)
			pinGroup.POST("", pinHandler.Create)
			pinGroup.PUT("/:id", pinHandler.Update)
			pinGroup.DELETE("/:id", pinHandler.Delete)
		}
	}

	return router
}
