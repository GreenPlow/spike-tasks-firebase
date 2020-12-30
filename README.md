# spike-list

To start this project locally run `docker-compose up` from project root

Then, after the server and database are up, run `npm start` from `./client`

Note - The client is commented out in the docker-compose file for the purposes of fast reloading during development. Starting the app with `npm start` will enable Air to reload the app when changes are made. Also, using npm will give you the correct ip address so you can access the app from a mobile device on the same network.

Mongo DB Express GUI
http://localhost:8081/

Client App GUI
http://localhost:3000/
