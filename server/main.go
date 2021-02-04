package main

import (
	"log"
	"net/http"

	"github.com/GreenPlow/spike-list/server/router"
)

func main() {
	r := router.Router()

	log.Println("Starting server on the port 8000...")

	log.Fatal(http.ListenAndServe(":8000", r))
}
