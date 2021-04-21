import React from "react";

import { setAlert } from "app/api/errorMessage";
import { addTask } from "app/api/taskRepository";
import { firebase } from "app/config/fire";

import moment from "moment";

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
  // TODO does the collection referece need to be await and try caught?
  const queryfield = "startDateTime";

  const query = await getCollectionRef()
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

function getCollectionRef() {
  return firebase
    .firestore()
    .collection(`users/${firebase.auth().currentUser.uid}/tasklist`);
}

async function createTask({ task, size, momentjsObj }, afterSuccess) {
  addTask();
  afterSuccess();
  // const user = firebase.auth().currentUser.uid;
  // addTask(user, {
  // task,
  //   size: size || null,
  //   startDateTime: Timestamp.fromDate(momentjsObj.toDate()),
  //   status: false,
  //   createdAt: FieldValue.serverTimestamp(),
  // });
  // afterSuccess();
  // try {
  //   await getCollectionRef().add({
  //     task,
  //     size: size || null,
  //     startDateTime: Timestamp.fromDate(momentjsObj.toDate()),
  //     status: false,
  //     createdAt: FieldValue.serverTimestamp(),
  //   });
  //   afterSuccess();
  // } catch (errorObj) {
  //   console.log(errorObj);
  //   setAlert({
  //     heading: "Oh Snap!",
  //     message: (
  //       <>
  //         <strong>{task} </strong>
  //         {"was not created..."}
  //       </>
  //     ),
  //   });
  // }
}

async function patchTask({ _id, property }, afterSuccess) {
  try {
    await getCollectionRef().doc(_id).update(property);
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
  try {
    await getCollectionRef().doc(_id).delete();
    afterSuccess();
  } catch (errorObj) {
    console.log(errorObj);
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

export function transformForFirebase(data) {
  // TODO this got around the firebase error, but hard to tell how the objects are different
  console.log("pre transform", data);
  for (const prop in data) {
    if (Object.prototype.hasOwnProperty.call(data, prop)) {
      if (data[prop] instanceof moment) {
        data[prop] = Timestamp.fromDate(data[prop].toDate());
      }
    }
  }
  console.log("post", data);
  return data;
}

async function updateTask(taskObj, afterUpdate) {
  const transformedObj = transformForFirebase(taskObj);
  // This is writing the _id back to the document when it was not previously there
  const { _id, task } = transformedObj;
  // TODO the Go API is not returning a Bad Request Error when json attributes are incorrect.
  // For example, remove the _ from id and it should throw an error, but doesn't
  try {
    await getCollectionRef.doc(_id).update(transformedObj);
    afterUpdate();
  } catch (errorObj) {
    // TODO still need to surface the errors somehow for logs/dev
    console.log(errorObj);
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
