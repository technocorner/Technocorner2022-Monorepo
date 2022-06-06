package question

import (
	"github.com/gin-gonic/gin"
)

type Question struct {
	RouterGroup *gin.RouterGroup
}

type subjectType struct {
	math string
	phys string
	comp string
}

var subjectEnum = &subjectType{math: "0", phys: "1", comp: "2"}
