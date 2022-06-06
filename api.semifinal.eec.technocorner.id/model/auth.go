package model

type Auth struct {
	Id    string `json:"id" binding:"required"`
	Email string `json:"email" binding:"required"`
}
