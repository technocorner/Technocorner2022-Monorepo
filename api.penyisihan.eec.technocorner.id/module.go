package main

import (
	"api.penyisihan.eec.technocorner.id/internal/pkg/database"
	"api.penyisihan.eec.technocorner.id/modules/auth"
	"api.penyisihan.eec.technocorner.id/modules/question"
	websocket "api.penyisihan.eec.technocorner.id/modules/webSocket"
	"github.com/gin-gonic/gin"
)

func module(ginEngine *gin.Engine, database database.Database) {
	authModule := &auth.Auth{RouterGroup: ginEngine.Group("auth"), Database: database}
	auth.Module(authModule)

	questionModule := &question.Question{RouterGroup: ginEngine.Group("question")}
	question.Module(questionModule)

	hub := websocket.NewHub()
	webSocketModule := &websocket.WebSocket{RouterGroup: ginEngine.Group("websocket"), Database: database, Hub: hub}
	websocket.Module(webSocketModule)
}
