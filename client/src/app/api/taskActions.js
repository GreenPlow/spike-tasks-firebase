import axios from "axios";
import React from "react";

import { setAlert } from "../errorMessage";
import { firebase } from "../config/fire";

// add the axios interceptors here to do the banners and logging, able to delete the try catches
// replace localhost with ip address to access app from a local network
const endpoint = "http://localhost:8000";
const Timestamp = firebase.firestore.Timestamp;
const FieldValue = firebase.firestore.FieldValue;

export function dataFromSnapshot(snapshot) {
  if (!snapshot.exists) return undefined;
  const data = snapshot.data();

  for (const prop in data) {
    if (Object.prototype.hasOwnProperty.call(data, prop)) {
      if (data[prop] instanceof firebase.firestore.Timestamp) {
        data[prop] = data[prop].toDate();
      }
    }
  }

  return {
    ...data,
    // underscore _ is a carryover from mongodb. To refactor, _ will need to be removed from all components
    _id: snapshot.id,
  };
}

async function getLatestTasksFromServer({ momentjsObj }) {
  const tasklistRef = firebase
    .firestore()
    .collection(`users/${firebase.auth().currentUser.uid}/tasklist`);
  const queryfield = "startDateTime";

  const query = await tasklistRef
    .where(
      queryfield,
      ">=",
      Timestamp.fromDate(momentjsObj.startOf("day").toDate())
    )
    .where(
      queryfield,
      "<=",
      Timestamp.fromDate(momentjsObj.endOf("day").toDate())
    )
    .get();

  const docsWithData = query.docs.map((doc) => {
    return dataFromSnapshot(doc);
  });
  return docsWithData;
}

async function createTask({ task, size, momentjsObj }, afterSuccess) {
  const tasklistRef = firebase
    .firestore()
    .collection(`users/${firebase.auth().currentUser.uid}/tasklist`);
  try {
    // TODO Do I need to await these?
    await tasklistRef.add({
      task,
      size,
      startDateTime: Timestamp.fromDate(momentjsObj.toDate()),
      status: false,
      createdAt: FieldValue.serverTimestamp(),
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

async function deleteTask({ _id }, afterSuccess) {
  const tasklistRef = firebase
    .firestore()
    .collection(`users/${firebase.auth().currentUser.uid}/tasklist`);
  try {
    await tasklistRef.doc(_id).delete();
    afterSuccess();
  } catch (errorObj) {
    setAlert({
      heading: "Well, this is embarassing...",
      message: (
        <>
          <strong>{_id} </strong>
          {"was not deleted"}
        </>
      ),
    });
  }
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
  createTask,
  deleteTask,
  updateTask,
  patchTask,
};
