
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "bootstrap/dist/css/bootstrap.min.css";
import "./TaskList.css";


// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const firebaseConfig = {
  apiKey: "AIzaSyAoubU_6fV8SwNKGRjKxgQas9mXG7OmfLE",
  authDomain: "spike-task-firebase.firebaseapp.com",
  projectId: "spike-task-firebase",
  storageBucket: "spike-task-firebase.appspot.com",
  messagingSenderId: "80902187036",
  appId: "1:80902187036:web:229a4feebedf1b9e8f97d9",
  measurementId: "G-M7VKFY9CV1",
};
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    // var uid = user.uid;
    console.log(user);
    // db.collection(`users/${uid}/tasklist`)
    //   .add({
    //     type: "bird",
    //   })
    //   .then((docRef) => {
    //     console.log("Document written with ID: ", docRef.id);
    //   })
    //   .catch((error) => {
    //     console.error("Error adding document: ", error);
    //   });
    // ...
  } else {
    // User is signed out
    // ...
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }
});

// const user = firebase.auth().currentUser;
// if (user.uid) {
//   const db = firebase.firestore();
//   db.collection(`users/${user.uid}/tasklist`)
//     .add({
//       type: "bird",
//     })
//     .then((docRef) => {
//       console.log("Document written with ID: ", docRef.id);
//     })
//     .catch((error) => {
//       console.error("Error adding document: ", error);
//     });
// }

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

