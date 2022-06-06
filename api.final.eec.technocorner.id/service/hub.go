package service

import "api.final.eec.technocorner.id/model"

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	Clients map[*Client]bool

	// Inbound messages from the clients.
	Broadcast chan interface{}

	// Register requests from the clients.
	Register chan *Client

	// Unregister requests from clients.
	Unregister chan *Client
}

func (h *Hub) Run(teams *[]model.Team, admin *model.Admin) {
	for {
		select {
		case client := <-h.Register:
			h.Clients[client] = true
		case client := <-h.Unregister:
			if _, ok := h.Clients[client]; ok {
				delete(h.Clients, client)
				close(client.Send)
				index := -1
				for i, val := range *teams {
					if val.Id == client.Code {
						index = i
					}
				}
				if index >= 0 {
					if (*teams)[index].Client == 1 {
						*teams = append((*teams)[:index], (*teams)[(index+1):]...)
					} else {
						(*teams)[index].Client -= 1
					}
				} else {
					(*admin) = model.Admin{Client: admin.Client - 1}
				}
			}
		case message := <-h.Broadcast:
			for client := range h.Clients {
				select {
				case client.Send <- message:
				default:
					close(client.Send)
					delete(h.Clients, client)
				}
			}
		}
	}
}
