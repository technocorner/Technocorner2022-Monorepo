package database

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"

	"api.final.eec.technocorner.id/model"
	"cloud.google.com/go/firestore"
	"google.golang.org/api/option"
)

// Use the application default credentials
func InitDb() *firestore.Client {
	ctx := context.Background()
	path, err := os.Getwd()
	if err != nil {
		log.Fatalln(err)
	}
	sa := option.WithCredentialsFile(fmt.Sprintf("%s/database/technocorner-2022-firebase-adminsdk-h74wl-802587ebb9.json", path))
	client, err := firestore.NewClient(ctx, "technocorner-2022", sa)
	if err != nil {
		log.Fatalln(err)
	}

	return client
}

func Close(client *firestore.Client) {
	client.Close()
}

func GetTeamData(client *firestore.Client, id string) (model.DbData, error) {
	ctx := context.Background()
	data, err := client.Collection("acara/eec/tim").Doc(id).Get(ctx)
	if !data.Exists() {
		err = errors.New("Doc not exist")
	}

	return model.DbData{ID: data.Ref.ID, Data: data.Data()}, err
}
