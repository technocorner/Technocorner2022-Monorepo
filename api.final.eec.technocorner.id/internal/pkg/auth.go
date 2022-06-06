package pkg

import (
	"errors"

	"api.final.eec.technocorner.id/database"
	"api.final.eec.technocorner.id/model"
	"cloud.google.com/go/firestore"
)

func Authenticate(client *firestore.Client, auth *model.Auth) (*model.DbData, error) {
	// teamId, err := Decrypt(auth.Code)
	// if err != nil {
	// 	return "", err
	// }
	teamId := auth.Code

	teamData, err := database.GetTeamData(client, teamId)
	if err != nil {
		return nil, err
	}

	// 3 = Tahap Grandfinal
	if int((teamData.Data["tahap"]).(int64)) != 3 {
		return nil, errors.New("Team code not valid")
	}

	return &teamData, nil
}
