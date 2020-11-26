# spike-list

To start this project locally run the following from project root
`docker-compose up`


Mongo DB Express GUI
http://localhost:8081/

Client App GUI
http://localhost:3000/


Note - Alternatively, you can comment out the client app in the docker-compose file and use `npm run` from `./client`
to start the React Client after the other parts are up. This will give you the correct ip address so you can access
the app from a mobile device on the same network.