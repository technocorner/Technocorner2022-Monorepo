package pkg

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Cors() gin.HandlerFunc {
	return cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://semifinal.eec.technocorner.id"},
		AllowHeaders:     []string{"content-type"},
		AllowMethods:     []string{"OPTION", "GET", "POST", "PUT", "DELETE"},
		AllowCredentials: true,
	})
}
