package websocket

import (
	"encoding/binary"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	"api.penyisihan.eec.technocorner.id/config"
	"github.com/gorilla/websocket"
)

func (w *WebSocket) getAuthorizationInfo(webSocketRequest *webSocketRequest) *user {
	// To be Removed
	demoTeamID := config.GetEnv(config.EnvEnum.DemoTeamID).([]string)
	demoUserEmail := config.GetEnv(config.EnvEnum.DemoUserEmail).([]string)
	demoUserName := config.GetEnv(config.EnvEnum.DemoUserName).([]string)
	for _, teamID := range demoTeamID {
		if teamID == webSocketRequest.GroupID {
			for i, userEmail := range demoUserEmail {
				if userEmail == webSocketRequest.UserID {
					return &user{groupID: teamID, userID: userEmail, userName: demoUserName[i]}
				}
			}
		}
	}
	// To be Removed

	adminID := config.GetEnv(config.EnvEnum.AdminID).(string)
	adminEmail := config.GetEnv(config.EnvEnum.AdminEmail).(string)

	if webSocketRequest.GroupID == adminID && webSocketRequest.UserID == adminEmail {
		return &user{groupID: "admin", userID: "admin", userName: "admin"}
	}

	teamData := w.getTeamData(webSocketRequest.GroupID)
	if teamData == nil {
		return nil
	}
	if int((teamData.Data["tahap"]).(int64)) != 1 {
		return nil
	}

	userExist := false
	peserta := teamData.Data["peserta"].([]interface{})
	for _, val := range peserta {
		if webSocketRequest.UserID == val.(map[string]interface{})["id"] {
			userExist = true
			break
		}
	}
	if !userExist {
		return nil
	}

	userData := w.getUserData(webSocketRequest.UserID)
	if userData == nil {
		return nil
	}

	return &user{groupID: webSocketRequest.GroupID, userID: userData.ID, userName: userData.Data["nama"].(string)}
}

func (h *hub) run() {
	tickerTimer := time.NewTicker(time.Second)

	defer func() {
		tickerTimer.Stop()
	}()

	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
			sendPositions(&h.clients, &client.user.groupID)
			sendAnswers(&h.clients, &client.user.groupID)
		case clientUnreg := <-h.unregister:
			if _, ok := h.clients[clientUnreg.client]; ok {
				if err := clientUnreg.client.conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(clientUnreg.closeCode, clientUnreg.closeText)); err != nil {
					log.Printf("Error(ws19): %v\n", err)
				}
				if err := clientUnreg.client.conn.Close(); err != nil {
					log.Printf("Error(ws12): %v\n", err)
				}
				delete(h.clients, clientUnreg.client)
				close(clientUnreg.client.send)
			}
		case broadcast := <-h.broadcast:
			switch broadcast.msgType {
			case &webSocketSyncDataRequestEnum.position:
				sendPositions(&h.clients, broadcast.groupId)
			case &webSocketSyncDataRequestEnum.answer:
				sendAnswers(&h.clients, broadcast.groupId)
			}
		case <-tickerTimer.C:
			// fmt.Println(h.clients)
			for client := range h.clients {
				mustClosed := false
				if checkIsSubmitted(&client.user.groupID) {
					mustClosed = true
					if err := client.conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(4996, "Answers have been submitted")); err != nil {
						log.Printf("Error(ws10): %v\n", err)
					}
				}
				if checkIsDeadlined(client.connDeadline) {
					mustClosed = true
					if err := client.conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(4995, "Deadline has passed")); err != nil {
						log.Printf("Error(ws13): %v\n", err)
					}
				}
				if mustClosed {
					if err := client.conn.Close(); err != nil {
						log.Printf("Error(ws22): %v\n", err)
					}
					close(client.send)
					delete(h.clients, client)
				} else {
					select {
					case client.send <- &webSocketSyncDataResponse{Type: webSocketSyncDataResponseEnum.timer, Payload: (client.connDeadline - time.Now().Local().UnixMilli()) / 1000}:
					default:
						if err := client.conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(1001, "Websocket closed by server")); err != nil {
							log.Printf("Error(ws17): %v\n", err)
						}
						if err := client.conn.Close(); err != nil {
							log.Printf("Error(ws18): %v\n", err)
						}
						close(client.send)
						delete(h.clients, client)
					}
				}
			}
		}
	}
}

func (c *client) readPump() {
	defer func() {
		c.hub.unregister <- &clientUnreg{client: c, closeCode: 1001, closeText: "Websocket closed by server"}
	}()

	if err := ensurePathReady(&c.user.groupID); err != nil {
		log.Printf("Error(ws1): %v\n", err)
		c.send <- &webSocketSyncDataResponse{Type: webSocketSyncDataResponseEnum.error, Payload: err.Error()}
		return
	}

	var bindReceivedData webSocketSyncDataRequest

	for {
		if err := c.conn.ReadJSON(&bindReceivedData); err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("Error(ws2): %v\n", err)
			}
			return
		}

		// fmt.Println(bindReceivedData)

		if bindReceivedData.Type == webSocketSyncDataRequestEnum.position {
			c.user.position = bindReceivedData.Position
			c.hub.broadcast <- &forwardRequest{groupId: &c.user.groupID, msgType: &webSocketSyncDataRequestEnum.position}
			continue
		}

		receivedData, err := json.Marshal(&bindReceivedData.Answered)
		if err != nil {
			log.Printf("Error(ws3): %v\n", err)
			c.send <- &webSocketSyncDataResponse{Type: webSocketSyncDataResponseEnum.error, Payload: err.Error()}
			continue
		}

		if err := writeData(&c.user.groupID, &receivedData); err != nil {
			log.Printf("Error(ws4): %v\n", err)
			c.send <- &webSocketSyncDataResponse{Type: webSocketSyncDataResponseEnum.error, Payload: err.Error()}
			continue
		}

		c.hub.broadcast <- &forwardRequest{groupId: &c.user.groupID, msgType: &webSocketSyncDataRequestEnum.answer}
	}
}

func (c *client) writePump() {
	defer func() {
		c.hub.unregister <- &clientUnreg{client: c, closeCode: 1001, closeText: "Websocket closed by server"}
	}()

	if err := ensurePathReady(&c.user.groupID); err != nil {
		log.Printf("Error(ws6): %v\n", err)
		if err := c.conn.WriteJSON(&webSocketSyncDataResponse{Type: webSocketSyncDataResponseEnum.error, Payload: err.Error()}); err != nil {
			log.Printf("Error(ws24): %v\n", err)
		}
		return
	}

	for {
		select {
		case data, ok := <-c.send:
			// fmt.Println(data, ok)
			if !ok {
				return
			}

			c.mu.Lock()
			if err := c.conn.WriteJSON(data); err != nil {
				log.Printf("Error(ws7): %v\n", err)
				return
			}
			c.mu.Unlock()
		}
	}
}

func getDeadline(ID string) (int64, error) {
	data, err := os.ReadFile(fmt.Sprintf("conf/deadline/%s", ID))
	if err != nil {
		return 0, err
	}
	deadline := int64(binary.LittleEndian.Uint64(data))
	return deadline, nil
}

func checkMultipleAccess(w *WebSocket, client *client) (*client, error) {
	for c := range w.Hub.clients {
		if c.user.userName == client.user.userName && c.user.groupID == client.user.groupID {
			err := errors.New("Multiple access detected")
			return c, err
		}
	}
	return nil, nil
}

func sendPositions(clients *map[*client]bool, groupID *string) {
	payload := make([]*webSocketSyncPositionResponse, 0)
	for client := range *clients {
		if client.user.groupID == *groupID {
			payload = append(payload, &webSocketSyncPositionResponse{UserName: client.user.userName, Position: client.user.position})
		}
	}

	for client := range *clients {
		if client.user.groupID == *groupID {
			client.send <- &webSocketSyncDataResponse{Type: *&webSocketSyncDataResponseEnum.position, Payload: &payload}
		}
	}
}

func sendAnswers(clients *map[*client]bool, groupID *string) {
	if checkIsSubmitted(groupID) {
		for c := range *clients {
			if c.user.groupID == *groupID {
				if err := c.conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(4996, "Answers have been submitted")); err != nil {
					log.Printf("Error(ws13): %v\n", err)
				}
			}
		}
		return
	}
	payloadData, err := readData(groupID)
	if err != nil {
		for c := range *clients {
			if c.user.groupID == *groupID {
				log.Printf("Error(ws8): %v\n", err)
				if err := c.conn.WriteJSON(&webSocketSyncDataResponse{Type: webSocketSyncDataResponseEnum.error, Payload: err.Error()}); err != nil {
					log.Printf("Error(ws9): %v\n", err)
					return
				}
			}
		}
	}
	if payloadData == nil {
		return
	}
	for c := range *clients {
		if c.user.groupID == *groupID {
			c.send <- &webSocketSyncDataResponse{Type: webSocketSyncDataResponseEnum.data, Payload: &webSocketSyncAnswerResponse{Time: time.Now(), Data: payloadData}}
		}
	}
}

func ensurePathReady(ID *string) error {
	path := "uploaded/answers"
	if _, err := os.Stat(path); os.IsNotExist(err) {
		if err := os.MkdirAll(path, os.ModePerm); err != nil {
			log.Printf("Error(ws5): %v\n", err)
			return err
		}
	}
	ansPath := fmt.Sprintf("%s/%s", path, *ID)
	if _, err := os.Stat(ansPath); os.IsNotExist(err) {
		if err := os.WriteFile(ansPath, nil, 0644); err != nil {
			return err
		}
	}
	return nil
}

func readData(ID *string) (*webSocketSyncAnswer, error) {
	savedData, err := os.ReadFile(fmt.Sprintf("uploaded/answers/%s", *ID))
	if err != nil {
		return nil, err
	}

	if len(savedData) == 0 {
		return nil, nil
	}

	var payloadData *webSocketSyncAnswer
	if err := json.Unmarshal(savedData, &payloadData); err != nil {
		return nil, err
	}

	return payloadData, nil
}

func writeData(ID *string, data *[]byte) error {
	path := "uploaded/answers"
	if err := os.WriteFile(fmt.Sprintf("%s/%s", path, *ID), *data, 0644); err != nil {
		return err
	}
	return nil
}

func checkIsDeadlined(deadline int64) bool {
	if time.Now().UnixMilli() > deadline {
		return true
	}
	return false
}

func checkIsSubmitted(ID *string) bool {
	path := fmt.Sprintf("uploaded/answers/submitted/%s", *ID)
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return false
	}
	return true
}
