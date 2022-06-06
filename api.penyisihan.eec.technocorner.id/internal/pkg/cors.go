package pkg

import (
	"api.penyisihan.eec.technocorner.id/config"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Cors() gin.HandlerFunc {
	corsOrigins := config.GetEnv(config.EnvEnum.Origins).([]string)

	return cors.New(cors.Config{
		AllowOrigins:     corsOrigins,
		AllowHeaders:     []string{"content-type"},
		AllowCredentials: true,
	})
}
