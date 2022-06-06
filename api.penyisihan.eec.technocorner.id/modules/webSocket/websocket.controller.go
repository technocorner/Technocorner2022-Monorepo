package websocket

import (
	"log"
	"net/http"

	"api.penyisihan.eec.technocorner.id/config"
	"api.penyisihan.eec.technocorner.id/internal/pkg/session"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

// [GET] /websocket?teamId=String&userEmail=String
//
// Res:
// (101) protocol upgrade (websocket) then {Type}
// or (400|401|500) {String(error)}
func webSocket(w *WebSocket) {
	go w.Hub.run()

	w.RouterGroup.GET("", func(ctx *gin.Context) {
		var webSocketRequest webSocketRequest
		if err := ctx.BindQuery(&webSocketRequest); err != nil {
			log.Printf("Error: %v\n", err)
			ctx.AbortWithStatusJSON(http.StatusBadRequest, err.Error())
			return
		}

		userData := w.getAuthorizationInfo(&webSocketRequest)
		if userData == nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, "User is not authorized")
			return
		}

		upgrader := websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
		}
		upgrader.CheckOrigin = func(r *http.Request) bool {
			currentOrigin := r.Header.Get("origin")
			allowedOrigins := config.GetEnv(config.EnvEnum.Origins).([]string)
			isAllowed := false

			for _, origin := range allowedOrigins {
				if origin == currentOrigin {
					isAllowed = true
					break
				}
			}

			return isAllowed
		}

		conn, err := upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
		if err != nil {
			log.Printf("Error: %v\n", err)
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, err.Error())
			return
		}

		deadline, err := getDeadline(userData.groupID)
		if err != nil {
			log.Printf("Error: %v\n", err)
			session.Clear(ctx)
			if err := conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(4995, "There is an error in your signin session. Please re-signin.")); err != nil {
				log.Printf("Error: %v\n", err)
			}
			if err := conn.Close(); err != nil {
				log.Printf("Error: %v\n", err)
			}
		}

		client := &client{user: &user{groupID: userData.groupID, userID: userData.userID, userName: userData.userName, position: &webSocketSyncPosition{Subject: 0, Number: 1}}, hub: w.Hub, conn: conn, connDeadline: deadline, send: make(chan *webSocketSyncDataResponse, 256)}

		if c, err := checkMultipleAccess(w, client); err != nil {
			log.Printf("Error: %v\n", err)
			w.Hub.unregister <- &clientUnreg{client: c, closeCode: 4999, closeText: "Multiple access detected"}
		}

		client.hub.register <- client

		go client.readPump()
		go client.writePump()
	})
}
