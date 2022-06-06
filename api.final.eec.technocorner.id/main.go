package main

import (
	"log"

	"api.final.eec.technocorner.id/api"
	"api.final.eec.technocorner.id/config"
	"api.final.eec.technocorner.id/database"
	"api.final.eec.technocorner.id/internal/pkg"
	"api.final.eec.technocorner.id/internal/pkg/helmet"
	"api.final.eec.technocorner.id/model"
	"github.com/gin-gonic/gin"
)

func main() {
	db := database.InitDb()

	hub := pkg.NewHub()
	teams := make([]model.Team, 0)
	admin := model.Admin{Client: 0}
	go hub.Run(&teams, &admin)

	r := gin.Default()

	r.SetTrustedProxies(nil)

	r.Use(helmet.Default())
	r.Use(pkg.Cors())
	r.Use(pkg.Session())

	api.Route(db, r, hub, &teams, &admin)

	if err := r.Run(config.Port); err != nil {
		log.Fatalln(err)
	}

	database.Close(db)
}
