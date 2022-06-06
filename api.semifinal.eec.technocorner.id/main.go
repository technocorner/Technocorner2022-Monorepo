package main

import (
	"log"

	"api.semifinal.eec.technocorner.id/api"
	"api.semifinal.eec.technocorner.id/config"
	"api.semifinal.eec.technocorner.id/database"
	"api.semifinal.eec.technocorner.id/internal/pkg"
	"api.semifinal.eec.technocorner.id/internal/pkg/helmet"
	"github.com/gin-gonic/gin"
)

func main() {
	// dbCred := pkg.Getenv()
	// mysqlDb, err := database.InitMysqlDb(dbCred)
	// if err != nil {
	// 	return
	// }

	fsDb := database.InitFsDb()

	r := gin.Default()

	r.SetTrustedProxies(nil)

	r.Use(helmet.Default())
	r.Use(pkg.Cors())
	r.Use(pkg.Session())

	// api.Route(r, fsDb, mysqlDb)
	api.Route(r, fsDb)

	if err := r.Run(config.Port); err != nil {
		log.Fatalln(err)
	}

	database.CloseFsDb(fsDb)
}
