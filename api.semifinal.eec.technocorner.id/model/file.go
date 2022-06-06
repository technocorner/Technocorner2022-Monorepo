package model

type File struct {
	Name string `form:"name" json:"name" binding:"required"`
	Lab  string `form:"lab" json:"lab" binding:"required"`
}
