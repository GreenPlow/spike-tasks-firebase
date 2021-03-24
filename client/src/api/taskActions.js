import axios from "axios";
import React from "react";

import { get } from "../user";
import { setAlert } from "../errorMessage";

import firebase from "firebase/app";
import "firebase/firestore";


// const firebase = require("firebase");
// // Required for side-effects
// require("firebase/firestore");

// add the axios interceptors here to do the banners and logging, able to delete the try catches
// replace localhost with ip address to access app from a local network
const endpoint = "http://localhost:8000";

// var citiesRef = db.collection("cities");

// async function getLatestTasksFromServer(date) {
//   const url =
//     endpoint +
//     `/api/task?searchDate=${date}&timeZone=${
//       Intl.DateTimeFormat().resolvedOptions().timeZone
//     }`;
//   try {
//     citiesRef.where("date", ">=", date);
//     const res = await axios.get(url);
//     return res.data;
//   } catch (errorObj) {
//     throw new Error(`failed to get tasks for ${date}`);
//   }
// }

async function getLatestTasksFromServer(date) {
  console.log(get());
  const url =
    endpoint +
    `/api/task?searchDate=${date}&timeZone=${
      Intl.DateTimeFormat().resolvedOptions().timeZone
    }`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (errorObj) {
    throw new Error(`failed to get tasks for ${date}`);
  }
}

async function createNewTask(task, taskSize, momentjsObj, afterSuccess) {
  const db = firebase.firestore();
  try {
    await db
      .collection(`users/${firebase.auth().currentUser.uid}/tasklist`)
      .add({
        task,
        taskSize,
        date: firebase.firestore.Timestamp.fromDate(momentjsObj.toDate()),
        status: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    afterSuccess();
  } catch (errorObj) {
    console.log(errorObj);
    setAlert({
      heading: "Oh Snap!",
      message: (
        <>
          <strong>{task} </strong>
          {"was not created..."}
        </>
      ),
    });
  }
}

// Use the intereptor to throw the error
async function patchTask({ _id, property }, afterSuccess) {
  const body = property;
  const url = endpoint + "/api/task/" + _id;
  try {
    await axios.patch(url, body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    afterSuccess();
  } catch (errorObj) {
    setAlert({
      heading: "Oh Snap!",
      message: (
        <>
          <strong>{Object.keys(property)[0]} </strong>
          {"was not updated"}
        </>
      ),
    });
  }
}

async function deleteTask(id) {
  const url = endpoint + "/api/deleteTask/" + id;
  await axios.delete(url, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}

async function updateTask(obj, afterUpdate) {
  const { _id, task } = obj;
  // TODO the Go API is not returning a Bad Request Error when json attributes are incorrect.
  // For example, remove the _ from id and it should throw an error, but doesn't
  const body = obj;
  const url = endpoint + "/api/updateTask/" + _id;
  try {
    await axios.put(url, body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    afterUpdate();
  } catch (errorObj) {
    setAlert({
      heading: "Well, this is embarassing...",
      message: (
        <>
          <strong>{task} </strong>
          {"was not updated"}
        </>
      ),
    });
  }
}

export {
  getLatestTasksFromServer,
  createNewTask,
  deleteTask,
  updateTask,
  patchTask,
};
