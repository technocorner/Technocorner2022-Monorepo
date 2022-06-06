package model

type Auth struct {
	Code string `json:"code" binding:"required"`
}
