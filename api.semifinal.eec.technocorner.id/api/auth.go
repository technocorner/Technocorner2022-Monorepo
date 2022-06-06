package api

import (
	"log"
	"net/http"

	"api.semifinal.eec.technocorner.id/data"
	"api.semifinal.eec.technocorner.id/internal/pkg"
	"api.semifinal.eec.technocorner.id/model"
	"cloud.google.com/go/firestore"
	"github.com/gin-gonic/gin"
)

// [GET] /auth/check-signin
// Res:
// (200) {teamId: string, teamName: string | "admin", userEmail: string, userName: string | "admin", role: "user" | "admin"}
// or (200) {signedIn: false}
func checkSignIn(ctx *gin.Context) {
	teamId := pkg.GetSession(ctx, "teamId")
	teamName := pkg.GetSession(ctx, "teamName")
	userEmail := pkg.GetSession(ctx, "userEmail")
	userName := pkg.GetSession(ctx, "userName")
	if teamName == nil || userName == nil {
		ctx.JSON(http.StatusOK, gin.H{"signedIn": false})
		return
	}

	role := "user"
	if teamId == data.AdminId && userEmail == data.AdminEmail {
		role = "admin"
	}

	ctx.JSON(http.StatusOK, gin.H{"teamName": teamName, "userName": userName, "role": role})
}

// [POST] /auth/signin
// Req:
// {id: string, email: string}
// Res:
// (200) {teamId: string, teamName: string | "admin", userEmail: string, userName: string | "admin", role: "user" | "admin"}
// or (400 | 404) {error: string}
func signIn(ctx *gin.Context, fsDb *firestore.Client) {
	var auth model.Auth
	if err := ctx.BindJSON(&auth); err != nil {
		log.Printf("Error: %v\n", err)
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	role := "user"
	// To be removed
	if auth.Id == "demo1" && auth.Email == "demo@1.com" {
		pkg.SetSession(ctx, "teamId", "demo1")
		pkg.SetSession(ctx, "teamName", "Demo Nama Tim")
		pkg.SetSession(ctx, "userEmail", "demo@1.com")
		pkg.SetSession(ctx, "userName", "Demo Nama Peserta")
		pkg.SaveSession(ctx)
	} else if auth.Id == data.AdminId && auth.Email == data.AdminEmail {
		pkg.SetSession(ctx, "teamId", auth.Id)
		pkg.SetSession(ctx, "teamName", "admin")
		pkg.SetSession(ctx, "userEmail", auth.Email)
		pkg.SetSession(ctx, "userName", "admin")
		pkg.SaveSession(ctx)
		role = "admin"
	} else {
		teamData, userData, err := pkg.Authenticate(fsDb, &auth)
		if err != nil {
			log.Printf("Error: %v\n", err)
			ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}

		pkg.SetSession(ctx, "teamId", teamData.ID)
		pkg.SetSession(ctx, "teamName", teamData.Data["nama"])
		pkg.SetSession(ctx, "userEmail", userData.ID)
		pkg.SetSession(ctx, "userName", userData.Data["nama"])
		pkg.SaveSession(ctx)
	}

	ctx.JSON(http.StatusOK, gin.H{"teamName": pkg.GetSession(ctx, "teamName"), "userName": pkg.GetSession(ctx, "userName"), "role": role})
}

// [POST] /auth/signout
// Req:
// {}
// Res:
// (200) {signedOut: true}
func signOut(ctx *gin.Context) {
	pkg.ClearSession(ctx)
	ctx.JSON(http.StatusOK, gin.H{"signedOut": true})
}
