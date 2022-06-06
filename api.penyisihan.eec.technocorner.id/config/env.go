package config

import (
	"errors"
	"log"
	"os"
	"strconv"
	"strings"
)

type env struct {
	Mode          int
	Port          int
	Origins       int
	SessionDomain int
	SessionMaxAge int
	AdminID       int
	AdminEmail    int
	DemoTeamID    int
	DemoTeamName  int
	DemoUserEmail int
	DemoUserName  int
}

var EnvEnum = env{Mode: 0, Port: 1, Origins: 2, SessionDomain: 3, SessionMaxAge: 4, AdminID: 5, AdminEmail: 6, DemoTeamID: 7, DemoTeamName: 8, DemoUserEmail: 9, DemoUserName: 10}

var envKey = map[int]string{
	EnvEnum.Mode:          "GIN_MODE",
	EnvEnum.Port:          "GIN_PORT",
	EnvEnum.Origins:       "GIN_ORIGINS",
	EnvEnum.SessionDomain: "GIN_SESSION_DOMAIN",
	EnvEnum.SessionMaxAge: "GIN_SESSION_MAX_AGE",
	EnvEnum.AdminID:       "EEC_ADMIN_ID",
	EnvEnum.AdminEmail:    "EEC_ADMIN_EMAIL",
	EnvEnum.DemoTeamID:    "EEC_DEMO_TEAM_ID",
	EnvEnum.DemoTeamName:  "EEC_DEMO_TEAM_NAME",
	EnvEnum.DemoUserEmail: "EEC_DEMO_USER_Email",
	EnvEnum.DemoUserName:  "EEC_DEMO_USER_NAME",
}

var envFunc = map[int]interface{}{
	EnvEnum.Mode:          mode,
	EnvEnum.Port:          port,
	EnvEnum.Origins:       origins,
	EnvEnum.SessionDomain: sessionDomain,
	EnvEnum.SessionMaxAge: sessionMaxAge,
	EnvEnum.AdminID:       adminID,
	EnvEnum.AdminEmail:    adminEmail,
	EnvEnum.DemoTeamID:    demoTeamID,
	EnvEnum.DemoTeamName:  demoTeamName,
	EnvEnum.DemoUserEmail: demoUserEmail,
	EnvEnum.DemoUserName:  demoUserName,
}

func GetAllEnv() map[int]interface{} {
	env := make(map[int]interface{}, 0)

	for key := range envKey {
		env[key] = GetEnv(key)
	}

	return env
}

func GetEnv(key int) interface{} {
	if len(envKey[key]) == 0 {
		err := errors.New("The environment variable is not listed")
		log.Printf("Error: %v\n", err)
		return nil
	}

	env := envFunc[key].(func() interface{})()
	return env
}

func mode() interface{} {
	mode := os.Getenv(envKey[EnvEnum.Mode])
	if len(mode) == 0 {
		mode = "debug"
	}
	return mode
}

func port() interface{} {
	port := os.Getenv(envKey[EnvEnum.Port])
	if len(port) == 0 {
		port = ":" + "8082"
	}
	return port
}

func origins() interface{} {
	origins := os.Getenv(envKey[EnvEnum.Origins])
	if len(origins) == 0 {
		switch mode() {
		case "debug":
			origins = "http://localhost:3000"
		case "release":
			origins = "https://penyisihan.eec.technocorner.id"
		}
	}
	origins = strings.ReplaceAll(origins, " ", "")
	return strings.Split(origins, ",")
}

func sessionDomain() interface{} {
	sessionDomain := os.Getenv(envKey[EnvEnum.SessionDomain])
	if len(sessionDomain) == 0 {
		switch mode() {
		case "debug":
			sessionDomain = "localhost"
		case "release":
			sessionDomain = "technocorner.id"
		}
	}
	return sessionDomain
}

func sessionMaxAge() interface{} {
	sessionMaxAge := os.Getenv(envKey[EnvEnum.SessionMaxAge])
	if len(sessionMaxAge) == 0 {
		switch mode() {
		case "debug":
			sessionMaxAge = strconv.Itoa(60 * 60)
		case "release":
			sessionMaxAge = strconv.Itoa(24 * 60 * 60)
		}
	}
	return sessionMaxAge
}

func adminID() interface{} {
	adminID := os.Getenv(envKey[EnvEnum.AdminID])
	if len(adminID) == 0 {
		adminID = "semangatTC22"
	}
	return adminID
}

func adminEmail() interface{} {
	adminEmail := os.Getenv(envKey[EnvEnum.AdminEmail])
	if len(adminEmail) == 0 {
		adminEmail = "mail@technocorner.id"
	}
	return adminEmail
}

func demoTeamID() interface{} {
	demoTeamIDString := os.Getenv(envKey[EnvEnum.DemoTeamID])
	if len(demoTeamIDString) == 0 {
		return []string{"demo1", "demo2"}
	}
	demoTeamID := strings.ReplaceAll(demoTeamIDString, " ", "")
	return strings.Split(demoTeamID, ",")
}

func demoTeamName() interface{} {
	demoTeamNameString := os.Getenv(envKey[EnvEnum.DemoTeamName])
	if len(demoTeamNameString) == 0 {
		return []string{"Demo Tim 1", "Demo Tim 2"}
	}
	demoTeamName := strings.ReplaceAll(demoTeamNameString, " ", "")
	return strings.Split(demoTeamName, ",")
}

func demoUserEmail() interface{} {
	demoUserEmailString := os.Getenv(envKey[EnvEnum.DemoUserEmail])
	if len(demoUserEmailString) == 0 {
		return []string{"demo@1.com", "demo@2.com", "demo@3.com", "demo@4.com", "demo@5.com", "demo@6.com"}
	}
	demoUserEmail := strings.ReplaceAll(demoUserEmailString, " ", "")
	return strings.Split(demoUserEmail, ",")
}

func demoUserName() interface{} {
	demoUserNameString := os.Getenv(envKey[EnvEnum.DemoTeamName])
	if len(demoUserNameString) == 0 {
		return []string{"Demo Peserta 1", "Demo Peserta 2", "Demo Peserta 3", "Demo Peserta 4", "Demo Peserta 5", "Demo Peserta 6"}
	}
	demoUserName := strings.ReplaceAll(demoUserNameString, " ", "")
	return strings.Split(demoUserName, ",")
}
