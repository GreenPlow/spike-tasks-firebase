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
		AllowedMethods: []string{"DELETE", "GET", "POST", "PUT"},
	})

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(c.Handler)

	r.Get("/api/task", handlers.GetAllTask)
	r.Post("/api/task", handlers.CreateTask)
	r.Put("/api/completeTask/{id}", handlers.CompleteTask)
	r.Put("/api/undoTask/{id}", handlers.UndoTask)
	r.Put("/api/updateTask/{id}", handlers.UpdateTask)
	r.Delete("/api/deleteTask/{id}", handlers.DeleteTask)
	r.Delete("/api/deleteAllTask", handlers.DeleteAllTask)

	return r
}
