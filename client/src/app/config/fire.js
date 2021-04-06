// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var app;

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

// TODO Should these sdk calls be handled for errors? They occur before react is rendered.

app = firebase.initializeApp(config);

// Initilize firestore
firebase.firestore(app);

export { firebase };
