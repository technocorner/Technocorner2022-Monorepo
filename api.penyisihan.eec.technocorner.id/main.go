package main

import "api.penyisihan.eec.technocorner.id/internal/pkg/database"

func main() {
	db := database.New(database.Init())
	defer db.Close()
	controller(db)
}
