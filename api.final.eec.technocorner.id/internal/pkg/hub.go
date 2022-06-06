package pkg

import "api.final.eec.technocorner.id/service"

func NewHub() *service.Hub {
	return &service.Hub{
		Broadcast:  make(chan interface{}),
		Register:   make(chan *service.Client),
		Unregister: make(chan *service.Client),
		Clients:    make(map[*service.Client]bool),
	}
}
