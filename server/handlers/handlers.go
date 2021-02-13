package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/GreenPlow/spike-list/server/models"
	"github.com/go-chi/chi"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const connectionString = "mongodb://mongo:27017"
const dbName = "test"
const collName = "tasklist"

// collection object/instance
var collection *mongo.Collection

func init() {
	log.Println("Setting up the mongo connection")

	clientOptions := options.Client().ApplyURI(connectionString)
	// connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}

	log.Println("Connection to MongoDB established!")
	collection = client.Database(dbName).Collection(collName)
	log.Println("Collection instance created!")
}

// GetAllTask get all the task route
func GetAllTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	payload := getAllTask()
	json.NewEncoder(w).Encode(payload)
}

// get all task from the DB and return it
func getAllTask() []primitive.M {
	cur, err := collection.Find(context.Background(), bson.D{{}})
	if err != nil {
		log.Fatal(err)
	}

	// make a slice to ensure nil is not returned
	results := make([]primitive.M, 0)
	for cur.Next(context.Background()) {
		var result bson.M
		e := cur.Decode(&result)
		if e != nil {
			log.Fatal(e)
		}

		results = append(results, result)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	cur.Close(context.Background())
	return results
}

// CreateTask create task route
func CreateTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	var task models.TaskList
	_ = json.NewDecoder(r.Body).Decode(&task)
	task.ID = insertOneTask(task)
	// Write the response of the task
	json.NewEncoder(w).Encode(task)
}

func insertOneTask(task models.TaskList) primitive.ObjectID {
	insertResult, err := collection.InsertOne(context.Background(), task)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Inserted a single record", insertResult.InsertedID)
	return insertResult.InsertedID.(primitive.ObjectID)
}

// CompleteTask complete the task route
func CompleteTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	taskID := chi.URLParam(r, "id")
	completeTask(taskID)
	json.NewEncoder(w).Encode(taskID)
}

func completeTask(task string) {
	log.Println(task)
	id, _ := primitive.ObjectIDFromHex(task)
	filter := bson.M{"_id": id}
	update := bson.M{"$set": bson.M{"status": true}}
	result, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("modified count: ", result.ModifiedCount)
}

// UndoTask undo the complete task route
func UndoTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")

	taskID := chi.URLParam(r, "id")
	undoTask(taskID)
	json.NewEncoder(w).Encode(taskID)
}

func undoTask(task string) {
	log.Println(task)
	id, _ := primitive.ObjectIDFromHex(task)
	filter := bson.M{"_id": id}
	update := bson.M{"$set": bson.M{"status": false}}
	result, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("modified count: ", result.ModifiedCount)
}

// UpdateTaskOptions delete one task route
func UpdateTaskOptions(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
}

// UpdateTask update the task route
func UpdateTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	taskID := chi.URLParam(r, "id")

	var taskObj models.TaskList
	_ = json.NewDecoder(r.Body).Decode(&taskObj)
	taskObj.ID, _ = primitive.ObjectIDFromHex(taskID)
	err := updateTask(taskObj)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	// TODO should task be encoded or the id?
	json.NewEncoder(w).Encode(taskObj)
}

func updateTask(taskObj models.TaskList) error {
	log.Println("inside updateTask, taskObj:", taskObj)
	filter := bson.M{"_id": taskObj.ID}
	update := bson.M{"$set": bson.M{"task": taskObj.Task}}

	result, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("modified count: ", result.ModifiedCount)
	if result.ModifiedCount < 1 {
		return errors.New("Failed to update record")
	}
	return nil
}

// DeleteTask delete one task route
func DeleteTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")

	taskID := chi.URLParam(r, "id")
	deleteOneTask(taskID)
	json.NewEncoder(w).Encode(taskID)
}

func deleteOneTask(task string) {
	log.Println(task)
	id, _ := primitive.ObjectIDFromHex(task)
	filter := bson.M{"_id": id}
	d, err := collection.DeleteOne(context.Background(), filter)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("deleted document", d.DeletedCount)

}

// DeleteAllTask delete all tasks route
func DeleteAllTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")

	count := deleteAllTask()
	json.NewEncoder(w).Encode(count)
}

func deleteAllTask() int64 {
	d, err := collection.DeleteMany(context.Background(), bson.D{{}}, nil)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Deleted Document", d.DeletedCount)
	return d.DeletedCount
}
