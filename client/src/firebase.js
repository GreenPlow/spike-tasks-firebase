import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

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
console.log("rept");

const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export const firestore = app.firestore();
export const time = firebase.firestore.Timestamp();
