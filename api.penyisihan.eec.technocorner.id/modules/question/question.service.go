package question

import (
	"fmt"
	"log"
	"net/http"

	"api.penyisihan.eec.technocorner.id/internal/pkg"
)

func (q *Question) getQuestionFile(questionRequest *questionRequest) *questionFileResponse {
	var subject string

	switch questionRequest.Subject {
	case subjectEnum.math:
		subject = "math"
	case subjectEnum.phys:
		subject = "phys"
	case subjectEnum.comp:
		subject = "comp"
	}

	return &questionFileResponse{FilePath: fmt.Sprintf("assets/%s/%s", subject, questionRequest.Number)}
}

func (q *Question) submitAnswerToFile(src, dstDir, dstFile string) *questionResponse {
	if err := pkg.CopyFile(src, dstDir, dstFile); err != nil {
		log.Printf("Error: %v\n", err)
		return &questionResponse{Code: http.StatusInternalServerError, Payload: err.Error()}
	}
	return &questionResponse{Code: http.StatusCreated, Payload: nil}
}
