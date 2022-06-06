package api

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type questionRequest struct {
	Lab string `form:"lab" binding:"required"`
}

func getQuestion(ctx *gin.Context) {
	var lab questionRequest

	if err := ctx.BindQuery(&lab); err != nil {
		log.Printf("Error: %v\n", err)
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	path := "labs"
	data, err := os.ReadFile(fmt.Sprintf("%s/%s", path, lab.Lab))
	if err != nil {
		log.Printf("Error: %v\n", err)
		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	labStatus := string(data)
	if labStatus == "disable" {
		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	ctx.File(fmt.Sprintf("questions/%s.pdf", lab.Lab))
}
