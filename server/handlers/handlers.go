package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/GreenPlow/spike-list/server/models"
	"github.com/go-chi/chi"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const connectionString = "mongodb://mongo:27017"
const dbName = "test"
const collPrefixTask = "tasklist"

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

	// log.Println("Connection to MongoDB established!")
	// // TODO should not connect to a non user prefix on init... What should it do?
	// collection = client.Database(dbName).Collection(collPrefixTask)
	// log.Println("Collection instance created!")
}

// CreateTask create task route
func CreateTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	user := r.Header.Get("X-USERNAME")
	fmt.Println("user", user)

	clientOptions := options.Client().ApplyURI(connectionString)
	client, conErr := mongo.Connect(context.TODO(), clientOptions)
	if conErr != nil {
		log.Fatal(conErr)
	}
	thisCollection := client.Database(dbName).Collection(collPrefixTask + "/" + user)

	var task models.TaskList
	_ = json.NewDecoder(r.Body).Decode(&task)
	task.ID = insertOneTask(task, thisCollection)
	// Write the response of the task
	json.NewEncoder(w).Encode(task)
}

func insertOneTask(task models.TaskList, collection *mongo.Collection) primitive.ObjectID {
	insertResult, err := collection.InsertOne(context.Background(), task)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Inserted a single record", insertResult.InsertedID)
	return insertResult.InsertedID.(primitive.ObjectID)
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

// fetch the url parameter `"userID"` from the request of a matching
// routing pattern. An example routing pattern could be: /users/{userID}
// dateString := chi.URLParam(r, "date")
// however, it makes more since for date to be a query param

// GetTasksByDate get all the task route
func GetTasksByDate(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")

	user := r.Header.Get("X-USERNAME")
	fmt.Println("user", user)
	clientOptions := options.Client().ApplyURI(connectionString)
	client, conErr := mongo.Connect(context.TODO(), clientOptions)
	if conErr != nil {
		log.Fatal(conErr)
	}
	thisCollection := client.Database(dbName).Collection(collPrefixTask + "/" + user)

	searchDate := r.URL.Query().Get("searchDate")
	fmt.Println("searchDate", searchDate)

	timeZone := r.URL.Query().Get("timeZone")
	fmt.Println("timeZone", timeZone)

	payload := getTasksByDate(searchDate, timeZone, thisCollection)
	json.NewEncoder(w).Encode(payload)
}

// get tasks by date from the DB and return it
func getTasksByDate(searchDateTime string, timeZone string, collection *mongo.Collection) []primitive.M {
	t, err := time.Parse(time.RFC3339, searchDateTime)
	fmt.Println("t", t)

	loc, _ := time.LoadLocation(timeZone)

	searchDateTimeInUserLoc := t.In(loc)
	fmt.Println("searchDateTimeInUserLoc", searchDateTimeInUserLoc)

	searchDateInUserLoc := time.Date(searchDateTimeInUserLoc.Year(), searchDateTimeInUserLoc.Month(), searchDateTimeInUserLoc.Day(), 0, 0, 0, 0, loc)
	fmt.Println("searchDateInUserLoc", searchDateInUserLoc)

	locUTC, _ := time.LoadLocation(timeZone)
	backtoUTC := searchDateInUserLoc.In(locUTC)

	nextDay := backtoUTC.AddDate(0, 0, 1)
	fmt.Println("nextDay", nextDay)

	// dayStart := searchDateInUserLoc.Format(time.RFC3339)
	// nextDay := searchDateInUserLoc.AddDate(0, 0, 1)
	// filter := bson.M{"date": bson.M{"$gte": searchDateInUserLoc, "$lt": nextDay}}

	filter := bson.M{"date": bson.M{"$gte": backtoUTC, "$lt": nextDay}}
	cur, err := collection.Find(context.Background(), filter)
	if err != nil {
		log.Fatal(err)
	}

	// make a slice to ensure nil is not returned
	results := make([]primitive.M, 0)
	for cur.Next(context.Background()) {
		println("Horse")
		var result bson.M
		e := cur.Decode(&result)
		if e != nil {
			log.Fatal(e)
		}
		println("result", result)

		results = append(results, result)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	cur.Close(context.Background())
	return results
}

// CompleteTask complete the task route
func CompleteTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")

	user := r.Header.Get("X-USERNAME")
	fmt.Println("user", user)
	clientOptions := options.Client().ApplyURI(connectionString)
	client, conErr := mongo.Connect(context.TODO(), clientOptions)
	if conErr != nil {
		log.Fatal(conErr)
	}
	thisCollection := client.Database(dbName).Collection(collPrefixTask + "/" + user)

	taskID := chi.URLParam(r, "id")
	completeTask(taskID, thisCollection)
	json.NewEncoder(w).Encode(taskID)
}

func completeTask(task string, collection *mongo.Collection) {
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

	user := r.Header.Get("X-USERNAME")
	fmt.Println("user", user)
	clientOptions := options.Client().ApplyURI(connectionString)
	client, conErr := mongo.Connect(context.TODO(), clientOptions)
	if conErr != nil {
		log.Fatal(conErr)
	}
	thisCollection := client.Database(dbName).Collection(collPrefixTask + "/" + user)

	taskID := chi.URLParam(r, "id")
	undoTask(taskID, thisCollection)
	json.NewEncoder(w).Encode(taskID)
}

func undoTask(task string, collection *mongo.Collection) {
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

	user := r.Header.Get("X-USERNAME")
	fmt.Println("user", user)
	clientOptions := options.Client().ApplyURI(connectionString)
	client, conErr := mongo.Connect(context.TODO(), clientOptions)
	if conErr != nil {
		log.Fatal(conErr)
	}
	thisCollection := client.Database(dbName).Collection(collPrefixTask + "/" + user)

	taskID := chi.URLParam(r, "id")

	var taskObj models.TaskList
	_ = json.NewDecoder(r.Body).Decode(&taskObj)
	taskObj.ID, _ = primitive.ObjectIDFromHex(taskID)
	err := updateTask(taskObj, thisCollection)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	// TODO should task be encoded or the id?
	json.NewEncoder(w).Encode(taskObj)
}

func updateTask(taskObj models.TaskList, collection *mongo.Collection) error {
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

	user := r.Header.Get("X-USERNAME")
	fmt.Println("user", user)
	clientOptions := options.Client().ApplyURI(connectionString)
	client, conErr := mongo.Connect(context.TODO(), clientOptions)
	if conErr != nil {
		log.Fatal(conErr)
	}
	thisCollection := client.Database(dbName).Collection(collPrefixTask + "/" + user)

	taskID := chi.URLParam(r, "id")
	deleteOneTask(taskID, thisCollection)
	json.NewEncoder(w).Encode(taskID)
}

func deleteOneTask(task string, collection *mongo.Collection) {
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

	user := r.Header.Get("X-USERNAME")
	fmt.Println("user", user)
	clientOptions := options.Client().ApplyURI(connectionString)
	client, conErr := mongo.Connect(context.TODO(), clientOptions)
	if conErr != nil {
		log.Fatal(conErr)
	}
	thisCollection := client.Database(dbName).Collection(collPrefixTask + "/" + user)

	count := deleteAllTask(thisCollection)
	json.NewEncoder(w).Encode(count)
}

func deleteAllTask(collection *mongo.Collection) int64 {
	d, err := collection.DeleteMany(context.Background(), bson.D{{}}, nil)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Deleted Document", d.DeletedCount)
	return d.DeletedCount
}
