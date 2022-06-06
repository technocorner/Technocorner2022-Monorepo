package database

import (
	"context"
	"log"

	"google.golang.org/api/iterator"
)

type DbData struct {
	ID   string
	Data map[string]interface{}
}

type DbQuery struct {
	Path  string
	Op    string
	Value interface{}
}

func (f *database) GetDocByID(path string, id string) (*DbData, error) {
	ctx := context.Background()

	data, err := f.client.Collection(path).Doc(id).Get(ctx)
	if err != nil {
		log.Printf("Error: %v\n", err)
		return nil, err
	}

	return &DbData{ID: data.Ref.ID, Data: data.Data()}, nil
}

func (f *database) GetDocs(path string) ([]*DbData, error) {
	ctx := context.Background()

	var data = make([]*DbData, 0)

	iter := f.client.Collection(path).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Printf("Error: %v\n", err)
			return nil, err
		}
		data = append(data, &DbData{ID: doc.Ref.ID, Data: doc.Data()})
	}

	return data, nil
}

func (f *database) GetDocsByQuery(path string, query DbQuery) ([]*DbData, error) {
	ctx := context.Background()

	var data = make([]*DbData, 0)

	iter := f.client.Collection(path).Where(query.Path, query.Op, query.Value).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Printf("Error: %v\n", err)
			return nil, err
		}
		data = append(data, &DbData{ID: doc.Ref.ID, Data: doc.Data()})
	}

	return data, nil
}
