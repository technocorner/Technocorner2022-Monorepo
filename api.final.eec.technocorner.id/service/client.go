package service

import (
	"fmt"
	"log"
	"time"

	"api.final.eec.technocorner.id/data"
	"api.final.eec.technocorner.id/model"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

// Client is a middleman between the websocket Connection and the Hub.
type Client struct {
	Hub *Hub

	// The websocket Connection.
	Conn *websocket.Conn

	// Buffered channel of outbound messages.
	Send chan interface{}

	Code string
}

// Send pings to peer with this period. Must be less than pongWait.
const pingPeriod = time.Second

// readPump pumps messages from the websocket Connection to the Hub.
//
// The application runs readPump in a per-Connection goroutine. The application
// ensures that there is at most one reader on a Connection by executing all
// reads from this goroutine.
func (c *Client) ReadPump(code string, teams *[]model.Team, admin *model.Admin) {
	defer func() {
		c.Hub.Unregister <- c
		c.Conn.Close()
	}()
	for {
		var message interface{}
		if err := c.Conn.ReadJSON(&message); err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		if _, ok := message.(map[string]interface{})["action"]; ok {
			switch message.(map[string]interface{})["action"].(string) {
			case "play":
				play := false
				for _, team := range *teams {
					if team.IsPlay {
						play = true
					}
				}
				if !play {
					index := 0
					for i, val := range *teams {
						if val.Id == code {
							index = i
						}
					}
					(*teams)[index].IsPlay = true
				}
			case "addScore":
				if code != data.AdminPass {
					break
				}
				addScore := message.(map[string]interface{})["add"]
				name := message.(map[string]interface{})["name"]
				index := 0
				for i, val := range *teams {
					if val.Name == name {
						index = i
					}
				}
				(*teams)[index].Score += int(addScore.(float64))
			case "resetPlayer":
				if code != data.AdminPass {
					break
				}
				for i, val := range *teams {
					if val.IsPlay {
						(*teams)[i].IsPlay = false
					}
				}
			case "resetScore":
				if code != data.AdminPass {
					break
				}
				for i := range *teams {
					(*teams)[i].Score = 0
				}
			}
		}
		c.Hub.Broadcast <- gin.H{"teams": teams, "admin": admin}
	}
}

// writePump pumps messages from the Hub to the websocket Connection.
//
// A goroutine running writePump is started for each Connection. The
// application ensures that there is at most one writer to a Connection by
// executing all writes from this goroutine.
func (c *Client) WritePump(teams *[]model.Team, admin *model.Admin) {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.Send:
			if !ok {
				// The Hub closed the channel.
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			if err := c.Conn.WriteJSON(message); err != nil {
				fmt.Println(err)
				return
			}
		case <-ticker.C:
			if err := c.Conn.WriteJSON(gin.H{"teams": teams, "admin": admin}); err != nil {
				fmt.Println(err)
				return
			}
		}
	}
}
