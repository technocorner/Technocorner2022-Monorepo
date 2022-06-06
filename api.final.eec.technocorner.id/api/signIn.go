package api

import (
	"log"
	"net/http"

	"api.final.eec.technocorner.id/data"
	"api.final.eec.technocorner.id/internal/pkg"
	"api.final.eec.technocorner.id/model"
	"cloud.google.com/go/firestore"
	"github.com/gin-gonic/gin"
)

func signIn(ctx *gin.Context, client *firestore.Client) {
	var auth model.Auth
	if err := ctx.BindJSON(&auth); err != nil {
		log.Printf("Error: %v\n", err)
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// To be removed
	demoCode := []string{"demo1", "demo2", "demo3"}
	for _, code := range demoCode {
		if code == auth.Code {
			pkg.SetSession(ctx, "id", code)
			pkg.SetSession(ctx, "name", code)
			pkg.SaveSession(ctx)
			ctx.JSON(http.StatusOK, gin.H{"wsCode": pkg.GetSession(ctx, "id"), "name": pkg.GetSession(ctx, "name"), "role": "user"})
			return
		}
	}

	if auth.Code == data.AdminPass {
		pkg.SetSession(ctx, "id", auth.Code)
		pkg.SetSession(ctx, "name", "admin")
		pkg.SaveSession(ctx)
		ctx.JSON(http.StatusOK, gin.H{"wsCode": pkg.GetSession(ctx, "id"), "name": pkg.GetSession(ctx, "name"), "role": "admin"})
		return
	}

	teamData, err := pkg.Authenticate(client, &auth)
	if err != nil {
		log.Printf("Error: %v\n", err)
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	// teamIdEncrypted, err := pkg.Encrypt(teamId)
	// if err != nil {
	// 	log.Printf("Error: %v\n", err)
	// 	ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 	return
	// }

	pkg.SetSession(ctx, "id", teamData.ID)
	pkg.SetSession(ctx, "name", teamData.Data["nama"])
	pkg.SaveSession(ctx)

	ctx.JSON(http.StatusOK, gin.H{"wsCode": pkg.GetSession(ctx, "id"), "name": pkg.GetSession(ctx, "name"), "role": "user"})
}
