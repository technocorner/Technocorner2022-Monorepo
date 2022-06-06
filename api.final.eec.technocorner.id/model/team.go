package model

type Team struct {
	Id     string `json:"-"`
	Name   string `json:"name"`
	Score  int    `json:"score"`
	IsPlay bool   `json:"isPlay"`
	Client int    `json:"client"`
}
