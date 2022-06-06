package api

import (
	"net/http"

	"api.final.eec.technocorner.id/data"
	"api.final.eec.technocorner.id/internal/pkg"
	"github.com/gin-gonic/gin"
)

func checkSignIn(ctx *gin.Context) {
	id := pkg.GetSession(ctx, "id")
	name := pkg.GetSession(ctx, "name")
	if id == nil || name == nil {
		ctx.JSON(http.StatusOK, gin.H{"signedIn": false})
		return
	}

	role := "user"
	if id == data.AdminPass {
		role = "admin"
	}

	ctx.JSON(http.StatusOK, gin.H{"wsCode": pkg.GetSession(ctx, "id"), "name": name, "role": role})
}
