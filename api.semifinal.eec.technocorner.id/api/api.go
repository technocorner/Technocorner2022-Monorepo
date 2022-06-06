package api

import (
	"cloud.google.com/go/firestore"
	"github.com/gin-gonic/gin"
)

func Route(router *gin.Engine, fsDb *firestore.Client) {
	router.GET("/auth/check-signin", checkSignIn)
	router.POST("/auth/signin", func(ctx *gin.Context) { signIn(ctx, fsDb) })
	router.POST("/auth/signout", signOut)
	router.GET("/lab/:number", getLab)
	router.GET("/lab/:number/:status", getChangeLabStatus)
	router.GET(("/question"), getQuestion)
	router.GET("/files", getFiles)
	router.GET("/file", getFile)
	router.DELETE("/file", deleteFile)
	router.POST("/file", postFile)
	router.POST("/link", postLink)
	router.GET("/links", getLinks)
}
