package question

import (
	"fmt"
	"log"
	"net/http"

	"api.penyisihan.eec.technocorner.id/internal/pkg/guard/auth"
	"api.penyisihan.eec.technocorner.id/internal/pkg/session"
	"github.com/gin-gonic/gin"
)

// [GET] /question?subject=Subject&number=Int
//
// Res:
// (304) File
// or (401) {String(error)}
func question(q *Question) {
	q.RouterGroup.GET("", func(ctx *gin.Context) {
		if !auth.AuthGuard(ctx) {
			return
		}

		var questionRequest questionRequest
		if err := ctx.BindQuery(&questionRequest); err != nil {
			log.Printf("Error: %v\n", err)
			ctx.AbortWithStatusJSON(http.StatusBadRequest, err.Error())
			return
		}

		ctx.File(q.getQuestionFile(&questionRequest).FilePath)
	})
}

func submitAnswer(q *Question) {
	q.RouterGroup.POST(("/submit"), func(ctx *gin.Context) {
		if !auth.AuthGuard(ctx) {
			return
		}

		teamID := session.Get(ctx, auth.SessionEnum.TeamID)

		src := fmt.Sprintf("uploaded/answers/%s", teamID)
		dstDir := "uploaded/answers/submitted"
		dstFile := fmt.Sprintf("%s/%s", dstDir, teamID)
		response := q.submitAnswerToFile(src, dstDir, dstFile)
		ctx.JSON(response.Code, response.Payload)
	})
}
