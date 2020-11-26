# Pull base image
FROM golang:alpine

# Install git
RUN apk update && apk add --no-cache git

# File location in the docker container 
WORKDIR /opt/server

COPY . .

RUN go mod download

# Install Air for hot reload
RUN go get -u github.com/cosmtrek/air

# Start air for hot reload
ENTRYPOINT air
