package pkg

import (
	"errors"

	"api.semifinal.eec.technocorner.id/database"
	"api.semifinal.eec.technocorner.id/model"
	"cloud.google.com/go/firestore"
)

func Authenticate(client *firestore.Client, auth *model.Auth) (*model.DbData, *model.DbData, error) {
	// teamId, err := Decrypt(auth.Code)
	// if err != nil {
	// 	return "", err
	// }

	teamData, err := database.GetTeamData(client, auth.Id)
	if err != nil {
		return nil, nil, err
	}

	// 2 = Tahap Semifinal
	if int((teamData.Data["tahap"]).(int64)) != 2 {
		return nil, nil, errors.New("Team code not valid")
	}

	userExist := false
	peserta := teamData.Data["peserta"]
	if peserta == nil {
		return nil, nil, errors.New("Team member not found")
	}
	for _, val := range peserta.([]interface{}) {
		if auth.Email == val.(map[string]interface{})["id"] {
			userExist = true
		}
	}
	if !userExist {
		return nil, nil, errors.New("User credential not match")
	}

	userData, err := database.GetUserData(client, auth.Email)
	if err != nil {
		return nil, nil, err
	}

	return &teamData, &userData, nil
}
