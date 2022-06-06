package api

import (
	"errors"
	"log"
	"net/http"

	"api.final.eec.technocorner.id/data"
	"api.final.eec.technocorner.id/internal/pkg"
	"api.final.eec.technocorner.id/model"
	"api.final.eec.technocorner.id/service"
	"cloud.google.com/go/firestore"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

func webSocket(client *firestore.Client, ctx *gin.Context, hub *service.Hub, teams *[]model.Team, admin *model.Admin) {
	code := ctx.Param("code")

	if len(code) == 0 {
		err := errors.New("Kode tidak tersedia")
		log.Printf("Error: %v\n", err)
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var dbData *model.DbData
	// To be removed
	demoCode := []string{"demo1", "demo2", "demo3"}
	for _, dcode := range demoCode {
		if dcode == code {
			dbData = &model.DbData{ID: dcode, Data: map[string]interface{}{"nama": dcode}}
		}
	}
	if dbData == nil && code != data.AdminPass {
		teamData, err := pkg.Authenticate(client, &model.Auth{Code: code})
		if err != nil {
			log.Printf("Error: %v\n", err)
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		dbData = teamData
	} else if code == data.AdminPass {
		dbData = &model.DbData{ID: data.AdminPass, Data: map[string]interface{}{"nama": "admin"}}
	}

	var upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}

	upgrader.CheckOrigin = func(r *http.Request) bool {
		origin := r.Header.Get("Origin")

		if origin == "http://localhost:3000" || origin == "https://final.eec.technocorner.id" {
			return true
		}

		return false
	}

	conn, err := upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		log.Printf("Error: %v\n", err)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if code != data.AdminPass {
		index := -1
		for i, val := range *teams {
			if val.Id == code {
				index = i
				break
			}
		}
		if index == -1 {
			*teams = append(*teams, model.Team{Id: code, Name: dbData.Data["nama"].(string), Score: 0, IsPlay: false, Client: 1})
		} else {
			(*teams)[index].Client += 1
		}
	} else {
		(*admin) = model.Admin{Client: admin.Client + 1}
	}

	clientWs := &service.Client{Hub: hub, Conn: conn, Send: make(chan interface{}), Code: code}
	clientWs.Hub.Register <- clientWs

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go clientWs.WritePump(teams, admin)
	go clientWs.ReadPump(code, teams, admin)
}
