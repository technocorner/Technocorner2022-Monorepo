package auth

import (
	"log"
	"net/http"

	"api.penyisihan.eec.technocorner.id/internal/pkg/session"
	"github.com/gin-gonic/gin"
)

type sessionType struct {
	TeamID   int
	TeamName int
	UserID   int
	UserName int
}

var SessionEnum = &sessionType{TeamID: 0, TeamName: 1, UserID: 2, UserName: 3}

func AuthGuard(ctx *gin.Context) bool {
	teamId := session.Get(ctx, SessionEnum.TeamID)
	teamName := session.Get(ctx, SessionEnum.TeamName)
	userEmail := session.Get(ctx, SessionEnum.UserID)
	userName := session.Get(ctx, SessionEnum.UserName)

	if teamId == nil || teamName == nil || userEmail == nil || userName == nil {
		log.Println("Error: Client unauthenticated")
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, "Client unauthenticated")
		return false
	}

	return true
}
