package auth

type authRequest struct {
	TeamID    string `json:"teamId" binding:"required"`
	UserEmail string `json:"userEmail" binding:"required"`
}

type authResponse struct {
	Code    int
	Payload interface{}
}

type authSessionData struct {
	TeamID   string `json:"teamId" binding:"required"`
	TeamName string `json:"teamName" binding:"required"`
	UserID   string `json:"userId" binding:"required"`
	UserName string `json:"userName" binding:"required"`
	Role     string `json:"role" binding:"required"`
}
