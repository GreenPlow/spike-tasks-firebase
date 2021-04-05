import axios from "axios";
import React from "react";

import { setAlert } from "../../errorMessage";

import { auth, appDb, firestore } from "../../fire";

// add the axios interceptors here to do the banners and logging, able to delete the try catches
// replace localhost with ip address to access app from a local network
const endpoint = "http://localhost:8000";

// async function getLatestTasksFromServer(date) {
//   console.log(get());
//   const url =
//     endpoint +
//     `/api/task?searchDate=${date}&timeZone=${
//       Intl.DateTimeFormat().resolvedOptions().timeZone
//     }`;
//   try {
//     const res = await axios.get(url);
//     return res.data;
//   } catch (errorObj) {
//     throw new Error(`failed to get tasks for ${date}`);
//   }
// }

async function getLatestTasksFromServer(date) {
  console.log(date);
  try {
    // let tasksRef = appDb.collection(`users/${auth.currentUser.uid}/tasklist`);
    // let results = await tasksRef
    //   .where("date", ">=", firestore.Timestamp.fromDate(date.toDate()))
    //   .get();
    // .then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     // doc.data() is never undefined for query doc snapshots
    //     console.log(doc.id, " => ", doc.data());
    //   });
    // });

    // citiesRef.doc("SF").set({
    //   name: "San Francisco",
    //   state: "CA",
    //   country: "USA",
    //   capital: false,
    //   population: 860000,
    //   regions: ["west_coast", "norcal"],
    // });
    // citiesRef.doc("LA").set({
    //   name: "Los Angeles",
    //   state: "CA",
    //   country: "USA",
    //   capital: false,
    //   population: 3900000,
    //   regions: ["west_coast", "socal"],
    // });
    // citiesRef.doc("DC").set({
    //   name: "Washington, D.C.",
    //   state: null,
    //   country: "USA",
    //   capital: true,
    //   population: 680000,
    //   regions: ["east_coast"],
    // });
    // citiesRef.doc("TOK").set({
    //   name: "Tokyo",
    //   state: null,
    //   country: "Japan",
    //   capital: true,
    //   population: 9000000,
    //   regions: ["kanto", "honshu"],
    // });
    // citiesRef.doc("BJ").set({
    //   name: "Beijing",
    //   state: null,
    //   country: "China",
    //   capital: true,
    //   population: 21500000,
    //   regions: ["jingjinji", "hebei"],
    // });
    var citiesRef = appDb.collection(`users/${auth.currentUser.uid}/cities`);

    citiesRef
      .where("capital", "==", true)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

    // var docRef = await appDb.collection(`users/${auth.currentUser.uid}/cities`);
    // citiesRef
    //   .where("state", "==", "CA")
    //   .get()
    //   .then((doc) => {
    //     if (doc.exists) {
    //       console.log("Document data:", doc.data());
    //     } else {
    //       // doc.data() will be undefined in this case
    //       console.log("No such document!");
    //     }
    //   })
    //   .catch((error) => {
    //     console.log("Error getting document:", error);
    //   });

    // return res.data;
  } catch (errorObj) {
    throw new Error(`failed to get tasks for ${date}`);
  }
}

async function createNewTask(task, taskSize, momentjsObj, afterSuccess) {
  try {
    let refCollection = appDb.collection(
      `users/${auth.currentUser.uid}/tasklist`
    );
    // TODO Do I need to await these?
    await refCollection.add({
      task,
      taskSize,
      date: firestore.Timestamp.fromDate(momentjsObj.toDate()),
      status: false,
      createdAt: firestore.FieldValue.serverTimestamp(),
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
