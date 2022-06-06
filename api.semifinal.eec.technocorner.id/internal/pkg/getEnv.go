package pkg

import (
	"os"

	"api.semifinal.eec.technocorner.id/model"
)

func Getenv() *model.DbCred {
	dbUser := os.Getenv("API_DB_USER")
	dbPass := os.Getenv("API_DB_PASS")
	dbAddr := os.Getenv("API_DB_ADDR")
	dbName := os.Getenv("API_DB_Name")
	return &model.DbCred{DbUser: dbUser, DbPass: dbPass, DbAddr: dbAddr, DbName: dbName}
}
