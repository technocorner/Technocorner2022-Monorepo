package main

import (
	"api.penyisihan.eec.technocorner.id/config"
	"api.penyisihan.eec.technocorner.id/internal/pkg"
	"api.penyisihan.eec.technocorner.id/internal/pkg/database"
	"api.penyisihan.eec.technocorner.id/internal/pkg/helmet"
	"api.penyisihan.eec.technocorner.id/internal/pkg/session"
	"github.com/gin-gonic/gin"
)

func controller(db database.Database) {
	router := gin.Default()

	router.SetTrustedProxies(nil)

	router.Use(helmet.Default())
	router.Use(pkg.Cors())
	router.Use(session.Init())

	module(router, db)

	port := config.GetEnv(config.EnvEnum.Port).(string)
	router.Run(port)
}
