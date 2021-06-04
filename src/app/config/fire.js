// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var app;

// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const config = {
  apiKey: "AIzaSyBQte0t0CUcPYvaP31E5EPB3GXUxxoDJEk",
  authDomain: "spike-tasks-2.firebaseapp.com",
  projectId: "spike-tasks-2",
  storageBucket: "spike-tasks-2.appspot.com",
  messagingSenderId: "147423274705",
  appId: "1:147423274705:web:3144a9cb3972039d9747f0",
  measurementId: "G-TX1BXW63EW"
};

// TODO Should these sdk calls be handled for errors? They occur before react is rendered.

app = firebase.initializeApp(config);

// Initilize firestore
firebase.firestore(app);

export { firebase };
