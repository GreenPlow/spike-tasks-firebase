package router

import (
	"github.com/GreenPlow/spike-list/server/handlers"
	"github.com/gorilla/mux"
)

//	"net/http"
//	"os"
// 	middle "github.com/gorilla/handlers"
// func loggingMiddleware(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		middle.LoggingHandler(os.Stdout, next)
// 		// Call the next handler, which can be another middleware in the chain, or the final handler.
// 		next.ServeHTTP(w, r)
// 	})
// }
// router.Use(loggingMiddleware)
// router.Use(mux.CORSMethodMiddleware(router))

// Router handles the api endpoints
func Router() *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/api/task", handlers.GetAllTask).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/task", handlers.CreateTask).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/completeTask/{id}", handlers.CompleteTask).Methods("PUT", "OPTIONS")
	router.HandleFunc("/api/undoTask/{id}", handlers.UndoTask).Methods("PUT", "OPTIONS")
	// pre-flight is invoking the real handler
	router.HandleFunc("/api/updateTask/{id}", handlers.UpdateTask).Methods("PUT", "OPTIONS")
	// if statement added in handlers.go to prevent delete pre-flight from invoking delete
	router.HandleFunc("/api/deleteTask/{id}", handlers.DeleteTask).Methods("DELETE", "OPTIONS")
	router.HandleFunc("/api/deleteAllTask", handlers.DeleteAllTask).Methods("DELETE", "OPTIONS")
	
	return router
}

