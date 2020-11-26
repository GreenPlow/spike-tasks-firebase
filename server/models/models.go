package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// ToDoList is something that needs to be defined later as it is required by the linter. //TODO
type ToDoList struct {
	ID primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`

	Task   string `json:"task,omitempty"`
	Status bool   `json:"status,omitempty"`
}
