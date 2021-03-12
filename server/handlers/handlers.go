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
var client *mongo.Client

func init() {
	log.Println("Setting up the mongo connection")

	clientOptions := options.Client().ApplyURI(connectionString)
	// connect to MongoDB
	var err error
	client, err = mongo.Connect(context.TODO(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}

	log.Println("Connection to MongoDB established!")
}

func getUser(r *http.Request) string {
	return r.Header.Get("X-USERNAME")
}

// CreateTask create task route
func CreateTask(w http.ResponseWriter, r *http.Request) {
	user := getUser(r)
	var task models.TaskList

	thisCollection := client.Database(dbName).Collection(collPrefixTask + "/" + user)

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

func convertToStartOfDay(UTCDateAndTimeString string, userTimeZone string) time.Time {
	t, err := time.Parse(time.RFC3339, UTCDateAndTimeString)
	if err != nil {
		log.Fatal(err)
	}

	userLoc, _ := time.LoadLocation(userTimeZone)

	dateAndTimeInUserLoc := t.In(userLoc)
	fmt.Println("dateAndTimeInUserLoc", dateAndTimeInUserLoc)

	startOfSearchDayInUserLoc := time.Date(dateAndTimeInUserLoc.Year(), dateAndTimeInUserLoc.Month(), dateAndTimeInUserLoc.Day(), 0, 0, 0, 0, userLoc)
	fmt.Println("startOfSearchDayInUserLoc", startOfSearchDayInUserLoc)

	// Lines 134 and 135 seem not needed? Same loc as line 125?
	locUTC, _ := time.LoadLocation(userTimeZone)
	startOfSearchDayInUTC := startOfSearchDayInUserLoc.In(locUTC)

	return startOfSearchDayInUTC
}

// GetTasksByDate get all the task route
func GetTasksByDate(w http.ResponseWriter, r *http.Request) {

	user := getUser(r)
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

	startOfSearchDay := convertToStartOfDay(searchDate, timeZone)
	startOfNextDay := startOfSearchDay.AddDate(0, 0, 1)

	payload := getTasksByDate(startOfSearchDay, startOfNextDay, thisCollection)
	json.NewEncoder(w).Encode(payload)
}

// get tasks by date from the DB and return it
func getTasksByDate(startOfSearchDay time.Time, startOfNextDay time.Time, collection *mongo.Collection) []primitive.M {

	filter := bson.M{"date": bson.M{"$gte": startOfSearchDay, "$lt": startOfNextDay}}
	cur, err := collection.Find(context.Background(), filter)
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

// CompleteTask complete the task route
func CompleteTask(w http.ResponseWriter, r *http.Request) {
	user := getUser(r)
	taskID := chi.URLParam(r, "id")

	thisCollection := client.Database(dbName).Collection(collPrefixTask + "/" + user)

	completeTask(taskID, thisCollection)
	json.NewEncoder(w).Encode(taskID)
}

func completeTask(task string, collection *mongo.Collection) {
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
	user := getUser(r)
	taskID := chi.URLParam(r, "id")

	thisCollection := client.Database(dbName).Collection(collPrefixTask + "/" + user)

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

// PatchTaskProperty on patch route
func PatchTaskProperty(w http.ResponseWriter, r *http.Request) {
	user := getUser(r)
	taskID := chi.URLParam(r, "id")

	thisCollection := client.Database(dbName).Collection(collPrefixTask + "/" + user)

	var taskTempObj models.TempPatchMakeThisDynamicLater
	_ = json.NewDecoder(r.Body).Decode(&taskTempObj)

	taskTempObj.ID, _ = primitive.ObjectIDFromHex(taskID)


	err := patchTaskProperty(taskTempObj, thisCollection)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	// TODO should task be encoded or the id?
	json.NewEncoder(w).Encode(taskTempObj)
}

func patchTaskProperty(taskTempObj models.TempPatchMakeThisDynamicLater, collection *mongo.Collection) error {
	log.Println("inside patch, taskTempObj:", taskTempObj)

	filter := bson.M{"_id": taskTempObj.ID}
	// The use of taskSize in the js request object, client, does not conform with how mongo is
	// taking everything to lowercase. This is an easy way to break this code. Can mongo be made to work with taskSize?
	// need better error messages back from mongo, aka schema validation. Currently returning 200s when problems like this occur
	update := bson.M{"$set": bson.M{"taskSize": taskTempObj.TaskSize}}

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

// UpdateTask update the task route
func UpdateTask(w http.ResponseWriter, r *http.Request) {
	user := getUser(r)
	taskID := chi.URLParam(r, "id")

	thisCollection := client.Database(dbName).Collection(collPrefixTask + "/" + user)

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
	filter := bson.M{"_id": taskObj.ID}
	update := bson.M{"$set": bson.M{"task": taskObj.Task, "date": taskObj.DateTime}}

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
	user := getUser(r)
	taskID := chi.URLParam(r, "id")

	thisCollection := client.Database(dbName).Collection(collPrefixTask + "/" + user)

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
