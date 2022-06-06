package model

type Lab struct {
	Id string `form:"lab" json:"lab" binding:"required"`
}
