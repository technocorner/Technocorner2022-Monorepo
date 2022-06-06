package auth

import (
	"encoding/binary"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"api.penyisihan.eec.technocorner.id/config"
	"api.penyisihan.eec.technocorner.id/internal/pkg/guard/auth"
	"api.penyisihan.eec.technocorner.id/internal/pkg/session"
	"github.com/gin-gonic/gin"
)

func (a *Auth) getCheckSignIn(ctx *gin.Context) *authResponse {
	teamID := session.Get(ctx, auth.SessionEnum.TeamID)
	teamName := session.Get(ctx, auth.SessionEnum.TeamName)
	userID := session.Get(ctx, auth.SessionEnum.UserID)
	userName := session.Get(ctx, auth.SessionEnum.UserName)
	if teamID == nil || teamName == nil || userID == nil || userName == nil {
		return &authResponse{Code: http.StatusOK, Payload: map[string]bool{"signedIn": false}}
	}

	role := "user"
	adminID := config.GetEnv(config.EnvEnum.AdminID).(string)
	adminEmail := config.GetEnv(config.EnvEnum.AdminEmail).(string)
	if teamID == adminID && userID == adminEmail {
		role = "admin"
	}

	return &authResponse{Code: http.StatusOK, Payload: &authSessionData{TeamID: teamID.(string), TeamName: teamName.(string), UserID: userID.(string), UserName: userName.(string), Role: role}}
}

func (a *Auth) postSignIn(ctx *gin.Context, authRequest *authRequest) *authResponse {
	competitionStartTime := time.Date(2022, time.Month(5), 11, 9, 0, 0, 0, time.Now().Local().Location()).UnixMilli()
	competitionDeadline := time.Date(2022, time.Month(5), 11, 11, 30, 0, 0, time.Now().Local().Location()).UnixMilli()
	competitionDurationHours := time.Duration(time.Hour * 2)

	// Check if the competition has started
	if time.Now().Local().UnixMilli() < competitionStartTime {
		return &authResponse{Code: http.StatusForbidden, Payload: "The competition hasn't started yet"}
	}
	// Check if the competition has ended
	if time.Now().Local().UnixMilli() > competitionDeadline {
		return &authResponse{Code: http.StatusForbidden, Payload: "The competition is over"}
	}

	authSession := &authSessionData{}

	// To be Removed
	demoTeamID := config.GetEnv(config.EnvEnum.DemoTeamID).([]string)
	demoUserEmail := config.GetEnv(config.EnvEnum.DemoUserEmail).([]string)
	for i, teamID := range demoTeamID {
		if teamID == authRequest.TeamID {
			for j, userEmail := range demoUserEmail {
				if userEmail == authRequest.UserEmail {
					demoTeamName := config.GetEnv(config.EnvEnum.DemoTeamName).([]string)
					demoUserName := config.GetEnv(config.EnvEnum.DemoUserName).([]string)
					authSession = &authSessionData{TeamID: teamID, TeamName: demoTeamName[i], UserID: demoUserEmail[j], UserName: demoUserName[j], Role: "user"}
				}
			}
		}
	}
	// To be Removed

	adminID := config.GetEnv(config.EnvEnum.AdminID).(string)
	adminEmail := config.GetEnv(config.EnvEnum.AdminEmail).(string)

	if *authSession == (authSessionData{}) {
		if authRequest.TeamID == adminID && authRequest.UserEmail == adminEmail {
			authSession = &authSessionData{TeamID: authRequest.TeamID, TeamName: "admin", UserID: authRequest.UserEmail, UserName: "admin", Role: "admin"}
		} else {
			teamData := a.getTeamData(authRequest.TeamID)
			if teamData == nil {
				return &authResponse{Code: http.StatusBadRequest, Payload: "Team code is not valid"}
			}
			if int((teamData.Data["tahap"]).(int64)) != 1 {
				return &authResponse{Code: http.StatusBadRequest, Payload: "Wrong team phase"}
			}

			userExist := false
			peserta := teamData.Data["peserta"].([]interface{})
			for _, val := range peserta {
				if authRequest.UserEmail == val.(map[string]interface{})["id"] {
					userExist = true
					break
				}
			}
			if !userExist {
				return &authResponse{Code: http.StatusBadRequest, Payload: "User credential not match"}
			}

			userData := a.getUserData(authRequest.UserEmail)
			if userData == nil {
				return &authResponse{Code: http.StatusBadRequest, Payload: "User not exist"}
			}

			authSession = &authSessionData{TeamID: teamData.ID, TeamName: teamData.Data["nama"].(string), UserID: userData.ID, UserName: userData.Data["nama"].(string), Role: "user"}
		}
	}

	{
		path := fmt.Sprintf("uploaded/answers/submitted/%s", authSession.TeamID)
		if _, err := os.Stat(path); err == nil {
			err := errors.New("Answers have been submitted")
			log.Printf("Error: %v\n", err)
			return &authResponse{Code: http.StatusForbidden, Payload: err.Error()}
		}
	}

	session.Set(ctx, auth.SessionEnum.TeamID, authSession.TeamID)
	session.Set(ctx, auth.SessionEnum.TeamName, authSession.TeamName)
	session.Set(ctx, auth.SessionEnum.UserID, authSession.UserID)
	session.Set(ctx, auth.SessionEnum.UserName, authSession.UserName)
	session.Save(ctx)

	{
		path := fmt.Sprintf("conf/deadline")
		if _, err := os.Stat(path); os.IsNotExist(err) {
			if err := os.MkdirAll(path, os.ModePerm); err != nil {
				log.Printf("Error: %v\n", err)
				return &authResponse{Code: http.StatusForbidden, Payload: err.Error()}
			}
		}
		deadlineExist := false
		timePath := fmt.Sprintf("%s/%s", path, authSession.TeamID)
		if _, err := os.Stat(timePath); err == nil {
			deadlineExist = true
		}
		if !deadlineExist {
			deadline := time.Now().Add(competitionDurationHours).UnixMilli()
			if deadline > competitionDeadline {
				deadline = competitionDeadline
			}
			data := make([]byte, 8)
			binary.LittleEndian.PutUint64(data, uint64(deadline))
			if err := os.WriteFile(timePath, data, 0644); err != nil {
				log.Printf("Error: %v\n", err)
				return &authResponse{Code: http.StatusForbidden, Payload: err.Error()}
			}
		}
	}

	return &authResponse{Code: http.StatusOK, Payload: &authSession}
}

func (a *Auth) postSignOut(ctx *gin.Context) *authResponse {
	session.Clear(ctx)
	return &authResponse{Code: http.StatusOK, Payload: true}
}
