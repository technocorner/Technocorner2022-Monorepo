package database

import (
	"context"
	"fmt"
	"log"
	"os"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/option"
)

type Database interface {
	Close()
	GetDocByID(path string, id string) (*DbData, error)
	GetDocs(path string) ([]*DbData, error)
	GetDocsByQuery(path string, query DbQuery) ([]*DbData, error)
}

type database struct {
	client *firestore.Client
}

func New(client *firestore.Client) Database {
	return &database{
		client: client,
	}
}

// Use the application default credentials
func Init() *firestore.Client {
	ctx := context.Background()
	path, err := os.Getwd()
	if err != nil {
		log.Fatalln(err)
	}
	sa := option.WithCredentialsFile(fmt.Sprintf("%s/internal/pkg/database/technocorner-2022-firebase-adminsdk-h74wl-802587ebb9.json", path))
	client, err := firestore.NewClient(ctx, "technocorner-2022", sa)
	if err != nil {
		log.Fatalln(err)
	}

	return client
}

func (f *database) Close() {
	f.client.Close()
}
