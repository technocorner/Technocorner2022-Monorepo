package api

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func getLab(ctx *gin.Context) {
	labNumber := ctx.Param("number")

	path := "labs"
	data, err := os.ReadFile(fmt.Sprintf("%s/%s", path, labNumber))
	if err != nil {
		log.Printf("Error: %v\n", err)
		ctx.JSON(http.StatusOK, false)
		return
	}

	labStatus := string(data)
	if labStatus == "disable" {
		ctx.JSON(http.StatusOK, false)
		return
	}

	ctx.JSON(http.StatusOK, true)
}

func getChangeLabStatus(ctx *gin.Context) {
	labNumber := ctx.Param("number")
	labStatus := ctx.Param("status")

	path := "labs"
	if _, err := os.Stat(path); os.IsNotExist(err) {
		if err := os.MkdirAll(path, os.ModePerm); err != nil {
			log.Printf("Error: %v\n", err)
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	if labStatus != "enable" && labStatus != "disable" {
		err := errors.New("Wrong status")
		log.Printf("Error: %v\n", err)
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := os.WriteFile(fmt.Sprintf("%s/%s", path, labNumber), []byte(labStatus), 0644); err != nil {
		log.Printf("Error: %v\n", err)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"success": true, "labStatus": labStatus})
}
