package api

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"api.semifinal.eec.technocorner.id/internal/pkg"
	"api.semifinal.eec.technocorner.id/model"
	"github.com/gin-gonic/gin"
)

// [GET] /links?lab=labId
// Res:
// (200) string[]
// or (400 | 403 | 400) {error: string}
func getLinks(ctx *gin.Context) {
	teamId := pkg.GetSession(ctx, "teamId")
	if teamId == nil || len(teamId.(string)) == 0 {
		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Not signed in"})
		return
	}

	var lab model.Lab
	if err := ctx.BindQuery(&lab); err != nil {
		log.Printf("Error: %v\n", err)
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	data, err := os.ReadFile(fmt.Sprintf("uploaded/links/%s/%s", lab.Id, teamId))
	if err != nil {
		log.Printf("Error: %v\n", err)
		ctx.JSON(http.StatusOK, []string{"", "", "", "", ""})
		return
	}

	urls := string(data)
	links := strings.Split(urls, "\n")

	if len(links) == 1 && len(links[0]) == 0 {
		links = nil
	}

	ctx.JSON(http.StatusOK, links)
}

// [POST] /link
// Req:
// {lab: String(labId), url: string[]}
// Res:
// (201) {success: true}
// or (400 | 403 | 500) {error: string}
func postLink(ctx *gin.Context) {
	teamId := pkg.GetSession(ctx, "teamId")
	if teamId == nil || len(teamId.(string)) == 0 {
		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Not signed in"})
		return
	}

	var link model.Link
	if err := ctx.BindJSON(&link); err != nil {
		log.Printf("Error: %v\n", err)
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	links := link.Urls
	if len(links) == 0 {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Empty link"})
	}

	urls := ""
	for _, url := range links {
		urls += fmt.Sprintf("%s\n", url)
	}

	data := []byte(urls)
	path := fmt.Sprintf("uploaded/links/%s", link.Lab)
	if _, err := os.Stat(path); os.IsNotExist(err) {
		if err := os.MkdirAll(path, os.ModePerm); err != nil {
			log.Printf("Error: %v\n", err)
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}
	if err := os.WriteFile(fmt.Sprintf("%s/%s", path, teamId), data, 0644); err != nil {
		log.Printf("Error: %v\n", err)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"success": true})
}
