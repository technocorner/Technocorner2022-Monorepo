package api

import (
	"api.final.eec.technocorner.id/model"
	"api.final.eec.technocorner.id/service"
	"cloud.google.com/go/firestore"
	"github.com/gin-gonic/gin"
)

func Route(client *firestore.Client, router *gin.Engine, hub *service.Hub, teams *[]model.Team, admin *model.Admin) {
	router.GET("/auth/check-signin", checkSignIn)
	router.POST("/auth/signin", func(ctx *gin.Context) { signIn(ctx, client) })
	router.POST("/auth/signout", signOut)
	router.GET("/ws/:code", func(ctx *gin.Context) { webSocket(client, ctx, hub, teams, admin) })
	router.GET("/score/get")
}
