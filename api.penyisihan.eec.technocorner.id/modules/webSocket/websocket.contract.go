package websocket

import "time"

type webSocketRequest struct {
	GroupID string `form:"groupId" binding:"required"`
	UserID  string `form:"userId" binding:"required"`
}

type webSocketResponse struct {
	Code    int
	Payload interface{}
}

type webSocketSyncDataRequest struct {
	Type     int                    `json:"type" binding:"required"`
	Position *webSocketSyncPosition `json:"position"`
	Answered *webSocketSyncAnswer   `json:"answered"`
}

type webSocketSyncDataResponse struct {
	Type    int         `json:"type"`
	Payload interface{} `json:"payload"`
}

type webSocketSyncAnswerResponse struct {
	Time time.Time            `json:"time"`
	Data *webSocketSyncAnswer `json:"data"`
}
type webSocketSyncPosition struct {
	Subject int `json:"subject"`
	Number  int `json:"number"`
}

type webSocketSyncPositionResponse struct {
	UserName string                 `json:"userName"`
	Position *webSocketSyncPosition `json:"position"`
}

type webSocketSyncAnswer interface{}

type webSocketSyncDataRequestType struct {
	position int
	answer   int
}

type webSocketSyncDataResponseType struct {
	error    int
	timer    int
	position int
	data     int
	ping     int
}

var webSocketSyncDataRequestEnum = &webSocketSyncDataRequestType{position: 0, answer: 1}

var webSocketSyncDataResponseEnum = &webSocketSyncDataResponseType{error: 0, timer: 1, position: 2, data: 3, ping: 4}
