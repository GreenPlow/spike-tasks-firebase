package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/GreenPlow/spike-list/server/models"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

//for localhost mongoDbB
// const connectionString = "mongodb://localhost:27017"
//const connectionString = "Conenction String"

const connectionString = "mongodb://mongo:27017"
const dbName = "test"
const collName = "tasklist"

// collection object/instance
var collection *mongo.Collection

func init() {
	fmt.Println("Setting up the mongo connection")

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

	fmt.Println("Connection to MongoDB established!")
	collection = client.Database(dbName).Collection(collName)
	fmt.Println("Collection instance created!")
}

// GetAllTask get all the task route
func GetAllTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
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
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-control-Allow-Headers", "Content-Type")
	var task models.TaskList
	_ = json.NewDecoder(r.Body).Decode(&task)
	insertOneTask(task)
	// Write the response of the task
	json.NewEncoder(w).Encode(task)
}

func insertOneTask(task models.TaskList) {
	insertResult, err := collection.InsertOne(context.Background(), task)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Inserted a single record", insertResult.InsertedID)
}

// CompleteTask complete the task route
func CompleteTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "PUT")
	w.Header().Set("Access-control-Allow-Headers", "Content-Type")
	params := mux.Vars(r)
	completeTask(params["id"])
	json.NewEncoder(w).Encode(params["id"])
}

func completeTask(task string) {
	fmt.Println(task)
	id, _ := primitive.ObjectIDFromHex(task)
	filter := bson.M{"_id": id}
	update := bson.M{"$set": bson.M{"status": true}}
	result, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("modified count: ", result.ModifiedCount)
}

// UndoTask undo the complete task route
func UndoTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "PUT")
	w.Header().Set("Access-control-Allow-Headers", "Content-Type")

	params := mux.Vars(r)
	undoTask(params["id"])
	json.NewEncoder(w).Encode(params["id"])
}

func undoTask(task string) {
	fmt.Println(task)
	id, _ := primitive.ObjectIDFromHex(task)
	filter := bson.M{"_id": id}
	update := bson.M{"$set": bson.M{"status": false}}
	result, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("modified count: ", result.ModifiedCount)
}

// UpdateTaskOptions delete one task route
func UpdateTaskOptions(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "PUT")
	w.Header().Set("Access-control-Allow-Headers", "Content-Type")
}

// UpdateTask update the task route
func UpdateTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "PUT")
	w.Header().Set("Access-control-Allow-Headers", "Content-Type")

	params := mux.Vars(r)
	fmt.Println("inside UpdateTask", params)
	// updateTask(params["id"], params["task"])
	// json.NewEncoder(w).Encode(params["id"])

	var task models.TaskList
	_ = json.NewDecoder(r.Body).Decode(&task)
		updateTask(params["id"], task)
	json.NewEncoder(w).Encode(task)
}

func updateTask(id string, task models.TaskList) {
	fmt.Println("inside updateTask", task)
	filter := bson.M{"_id": task.ID}
	update := bson.M{"$set": bson.M{"task": task.Task}}
	fmt.Println("test access to attr task", task.Task)
	fmt.Println("test access to attr id", task.ID)

	result, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal(err)
	}
	//

	fmt.Println("Modified a single record", result.UpsertedID)

	fmt.Println("modified count: ", result.ModifiedCount)
}

// DeleteTaskOptions delete one task route
func DeleteTaskOptions(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE")
	w.Header().Set("Access-control-Allow-Headers", "Content-Type")

	// params := mux.Vars(r)
	// deleteOneTask(params["id"])
	// json.NewEncoder(w).Encode(params["id"])
	// http.Error(w, "http status forbidden", http.StatusBadRequest)
}

// DeleteTask delete one task route
func DeleteTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE")
	w.Header().Set("Access-control-Allow-Headers", "Content-Type")

	// params := mux.Vars(r)
	// deleteOneTask(params["id"])
	// json.NewEncoder(w).Encode(params["id"])
	http.Error(w, "http status forbidden", http.StatusBadRequest)
}

func deleteOneTask(task string) {
	fmt.Println(task)
	id, _ := primitive.ObjectIDFromHex(task)
	filter := bson.M{"_id": id}
	d, err := collection.DeleteOne(context.Background(), filter)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("deleted document", d.DeletedCount)

}

// DeleteAllTask delete all tasks route
func DeleteAllTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	count := deleteAllTask()
	json.NewEncoder(w).Encode(count)
}

func deleteAllTask() int64 {
	d, err := collection.DeleteMany(context.Background(), bson.D{{}}, nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Deleted Document", d.DeletedCount)
	return d.DeletedCount
}
