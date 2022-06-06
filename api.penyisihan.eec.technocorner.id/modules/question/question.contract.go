package question

type questionRequest struct {
	Subject string `form:"subject" binding:"required"`
	Number  string `form:"number" binding:"required"`
}

type questionResponse struct {
	Code    int
	Payload interface{}
}

type questionFileResponse struct {
	FilePath string
}
