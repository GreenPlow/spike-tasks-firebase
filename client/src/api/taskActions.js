import axios from "axios";
import React from "react";

import { get } from "../user";
import { set } from "../errorMessage";

// add the axios interceptors here to do the banners and logging, able to delete the try catches
// replace localhost with ip address to access app from a local network
const endpoint = "http://localhost:8000";

axios.interceptors.request.use(function (config) {
  config.headers["X-USERNAME"] = get();
  return config;
});

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

async function createNewTask(task, taskSize, date) {
  const url = endpoint + "/api/task";
  const body = { task, taskSize, date, status: false };
  try {
    await axios.post(url, body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  } catch (errorObj) {
    throw new Error(`failed to create task: ${task}`);
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
    set({
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

async function completeTask(id) {
  const url = endpoint + "/api/completeTask/" + id;
  await axios.put(url, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}

async function deleteTask(id) {
  const url = endpoint + "/api/deleteTask/" + id;
  await axios.delete(url, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}

async function undoTask(id) {
  const url = endpoint + "/api/undoTask/" + id;
  await axios.put(url, {
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
    set({
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
  completeTask,
  deleteTask,
  undoTask,
  updateTask,
  patchTask,
};
