package auth

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// [GET] /auth/check-signin
//
// Res:
// (200) {signedIn: true, teamId: string, teamName: string | "admin", userEmail: string, userName: string | "admin", role: "user" | "admin"}
// or (200) {signedIn: false}
func checkSignIn(a *Auth) {
	a.RouterGroup.GET("/check-signin", func(ctx *gin.Context) {
		response := a.getCheckSignIn(ctx)
		ctx.JSON(response.Code, response.Payload)
	})
}

// [POST] /auth/signin
//
// Req:
// {id: string, email: string}
//
// Res:
// (200) {teamId: string, teamName: string | "admin", userEmail: string, userName: string | "admin", role: "user" | "admin"}
// or (400|404) {String(error)}
func signIn(a *Auth) {
	a.RouterGroup.POST("/signin", func(ctx *gin.Context) {
		var authRequest authRequest
		if err := ctx.BindJSON(&authRequest); err != nil {
			log.Printf("Error: %v\n", err)
			ctx.AbortWithStatusJSON(http.StatusBadRequest, err.Error())
			return
		}
		response := a.postSignIn(ctx, &authRequest)
		ctx.JSON(response.Code, response.Payload)
	})
}

// [POST] /auth/signout
//
// Req:
// {}
//
// Res:
// (200) {signedOut: true} //
func signOut(a *Auth) {
	a.RouterGroup.POST("/signout", func(ctx *gin.Context) {
		response := a.postSignOut(ctx)
		ctx.JSON(response.Code, response.Payload)
	})
}
