package websocket

import (
	"sync"

	"api.penyisihan.eec.technocorner.id/internal/pkg/database"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type WebSocket struct {
	RouterGroup *gin.RouterGroup
	Database    database.Database
	Hub         *hub
}

type hub struct {
	clients    map[*client]bool
	broadcast  chan *forwardRequest
	register   chan *client
	unregister chan *clientUnreg
}

type client struct {
	user         *user
	hub          *hub
	conn         *websocket.Conn
	connDeadline int64
	send         chan *webSocketSyncDataResponse
	mu           sync.Mutex
}

type user struct {
	groupID  string
	userID   string
	userName string
	position *webSocketSyncPosition
}

type forwardRequest struct {
	groupId *string
	msgType *int
}

type clientUnreg struct {
	client    *client
	closeCode int
	closeText string
}

func NewHub() *hub {
	return &hub{
		clients:    make(map[*client]bool),
		broadcast:  make(chan *forwardRequest),
		register:   make(chan *client),
		unregister: make(chan *clientUnreg),
	}
}

func (w *WebSocket) getTeamData(id string) *database.DbData {
	teamData, _ := w.Database.GetDocByID("acara/eec/tim", id)
	return teamData
}

func (w *WebSocket) getUserData(id string) *database.DbData {
	userData, _ := w.Database.GetDocByID("pengguna", id)
	return userData
}
