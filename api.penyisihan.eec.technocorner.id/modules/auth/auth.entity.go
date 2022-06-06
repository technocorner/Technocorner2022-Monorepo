package auth

import (
	"api.penyisihan.eec.technocorner.id/internal/pkg/database"
	"github.com/gin-gonic/gin"
)

type Auth struct {
	RouterGroup *gin.RouterGroup
	Database    database.Database
}

func (a *Auth) getTeamData(id string) *database.DbData {
	teamData, _ := a.Database.GetDocByID("acara/eec/tim", id)
	return teamData
}

func (a *Auth) getUserData(id string) *database.DbData {
	userData, _ := a.Database.GetDocByID("pengguna", id)
	return userData
}
