package database

import (
	"fmt"

	"api.semifinal.eec.technocorner.id/model"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func InitMysqlDb(dbCred *model.DbCred) (*gorm.DB, error) {
	// webdev:wd_semangatTC22@tcp(127.0.0.1:3306)/semifinal_eec?charset=utf8mb4&parseTime=True&loc=Local)
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", dbCred.DbUser, dbCred.DbPass, dbCred.DbAddr, dbCred.DbName)
	mysqlDb, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return nil, err
	}
	return mysqlDb, nil
}
