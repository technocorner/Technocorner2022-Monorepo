package api

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"api.semifinal.eec.technocorner.id/internal/pkg"
	"api.semifinal.eec.technocorner.id/model"
	"github.com/gin-gonic/gin"
)

// [GET] /files?lab=labId
// Res:
// (200) string[]
// or (403 | 500) {error: string}
func getFiles(ctx *gin.Context) {
	teamId := pkg.GetSession(ctx, "teamId")
	if teamId == nil || len(teamId.(string)) == 0 {
		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Not signed in"})
		return
	}

	var lab model.Lab
	if err := ctx.BindQuery(&lab); err != nil {
		log.Printf("Error: %v\n", err)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	teamFiles := make([]string, 0)

	f, err := os.Open(fmt.Sprintf("uploaded/files/%s/%s", lab.Id, teamId))
	if err != nil {
		log.Printf("Error: %v\n", err)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	files, err := f.ReadDir(0)
	if err != nil {
		log.Printf("Error: %v\n", err)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	for _, file := range files {
		if !file.IsDir() {
			teamFiles = append(teamFiles, file.Name())
		}
	}
	f.Close()

	ctx.JSON(http.StatusOK, teamFiles)
}

// [GET] /file?lab=labId&name=filename
// Res:
// (304) File
// or (400 | 403)
func getFile(ctx *gin.Context) {
	teamId := pkg.GetSession(ctx, "teamId")
	if teamId == nil || len(teamId.(string)) == 0 {
		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Not signed in"})
		return
	}

	var file model.File
	if err := ctx.BindQuery(&file); err != nil {
		log.Printf("Error: %v\n", err)
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.File(fmt.Sprintf("uploaded/files/%s/%s/%s", file.Lab, teamId, file.Name))
}

// [POST] /file
// Req:
// {lab: String(labId), files: File[] (multipart form)}
// Res:
// (201) {success: true}
// or (400 | 500) {error: string}
func postFile(ctx *gin.Context) {
	teamId := pkg.GetSession(ctx, "teamId")
	if teamId == nil || len(teamId.(string)) == 0 {
		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Not signed in"})
		return
	}

	form, err := ctx.MultipartForm()
	if err != nil {
		log.Printf("Error: %v\n", err)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	lab := form.Value["lab"][0]
	if len(lab) == 0 {
		log.Printf("Error: %v\n", err)
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	files := form.File["files"]

	path := fmt.Sprintf("uploaded/files/%s/%s", lab, teamId)
	if _, err := os.Stat(path); os.IsNotExist(err) {
		if err := os.MkdirAll(path, os.ModePerm); err != nil {
			log.Printf("Error: %v\n", err)
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
	for _, file := range files {
		filePath := fmt.Sprintf("%s/%s", path, file.Filename)

		if err := ctx.SaveUploadedFile(file, filePath); err != nil {
			log.Printf("Error: %v\n", err)
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	ctx.JSON(http.StatusCreated, gin.H{"success": true})
}

// [DELETE] /file
// Req:
// {lab: String(labId), name: string}
// Res:
// (201) {success: true}
// or (400 | 500) {error: string}
func deleteFile(ctx *gin.Context) {
	teamId := pkg.GetSession(ctx, "teamId")
	if teamId == nil || len(teamId.(string)) == 0 {
		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Not signed in"})
		return
	}

	var file model.File
	if err := ctx.BindJSON(&file); err != nil {
		log.Printf("Error: %v\n", err)
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := os.Remove(fmt.Sprintf("uploaded/files/%s/%s/%s", file.Lab, teamId, file.Name)); err != nil {
		log.Println(err)
	}

	ctx.JSON(http.StatusOK, gin.H{"success": true})
}
