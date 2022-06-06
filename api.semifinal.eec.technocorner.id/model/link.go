package model

type Link struct {
	Urls []string `json:"urls" binding:"required"`
	Lab  string   `form:"lab" json:"lab" binding:"required"`
}
