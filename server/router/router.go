package router

import (
	"github.com/GreenPlow/spike-list/server/handlers"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/rs/cors"
)

// Router handles the api endpoints
func Router() *chi.Mux {
	r := chi.NewRouter()

	c := cors.New(cors.Options{
		AllowedMethods:   []string{"DELETE", "GET", "POST", "PUT"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(c.Handler)

	// r.Get("/api/task", handlers.GetAllTask)
	r.Get("/api/task", handlers.GetTasksByDate)
	r.Post("/api/task", handlers.CreateTask)
	// r.Delete("/api/task", handlers.CreateTask) // delete everything
	// r.Put("/api/task/{id}", handlers.CreateTask) // everything
	// r.Patch("/api/task/{id}", handlers.CreateTask) // only changes
	// r.Delete("/api/task/{id}", handlers.CreateTask) // delete

	// Convenience Method
	// r.Post("/api/task/{id}/complete", handlers.CreateTask) // complete
	// r.Post("/api/task/{id}/undo", handlers.CreateTask) // undo

	// Will eventually remove these endpoints below
	r.Put("/api/completeTask/{id}", handlers.CompleteTask)
	r.Put("/api/undoTask/{id}", handlers.UndoTask)
	r.Put("/api/updateTask/{id}", handlers.UpdateTask)
	r.Delete("/api/deleteTask/{id}", handlers.DeleteTask)
	r.Delete("/api/deleteAllTask", handlers.DeleteAllTask)

	return r
}
