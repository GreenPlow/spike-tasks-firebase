// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

var app;
var appAuth;
var appDb;
var firestore;

function init() {
  // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
  const config = {
    apiKey: "AIzaSyAoubU_6fV8SwNKGRjKxgQas9mXG7OmfLE",
    authDomain: "spike-task-firebase.firebaseapp.com",
    projectId: "spike-task-firebase",
    storageBucket: "spike-task-firebase.appspot.com",
    messagingSenderId: "80902187036",
    appId: "1:80902187036:web:229a4feebedf1b9e8f97d9",
    measurementId: "G-M7VKFY9CV1",
  };

  app = firebase.initializeApp(config);
  appAuth = firebase.auth(app);
  appDb = firebase.firestore(app);
  firestore = firebase.firestore;
  console.log("init finished");
}

export { init, app, appDb, firestore, appAuth };
