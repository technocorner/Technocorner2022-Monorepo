package api

import (
	"net/http"

	"api.final.eec.technocorner.id/internal/pkg"
	"github.com/gin-gonic/gin"
)

func signOut(ctx *gin.Context) {
	pkg.ClearSession(ctx)
	ctx.JSON(http.StatusOK, gin.H{"signedOut": true})
}
