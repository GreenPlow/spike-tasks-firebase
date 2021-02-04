/* eslint-disable*/

import axios from "axios";
import handleAxiosError from "./errorHandler"
// add the axios interceptors here to do the banners and logging, able to delete the try catches
// replace localhost with ip address to access app from a local network
const endpoint = "http://localhost:8000";

async function getLatestTasksFromServer() {
  const res = await axios.get(endpoint + "/api/task");
  return res.data;
}

async function createNewTask(task) {
  const url = endpoint + "/api/task";
  const body = { task };
  await axios.post(url, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}

async function completeTask(id) {
  const url = endpoint + "/api/completeTask/" + id;
  await axios.put(url, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}

async function deleteTask(id) {
  const url = endpoint + "/api/deleteTask/" + id;
  try {
    await axios.delete(url, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  } catch (errorObj) {
    handleAxiosError(errorObj);
  }
}

async function undoTask(id) {
  const url = endpoint + "/api/undoTask/" + id;
  await axios.put(url, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}

async function updateTask(taskObject) {
  const { task, id } = taskObject;
  console.log("update function", id);
  // Try pushing in the id to the body also... seems like overkill to have it as an endpoint too?
  // TODO the Go API is not returning a Bad Request Error when json attributes are incorrect. for example, remove the _ from id and it should throw an error, but doesn't
  const body = { task };
  const url = endpoint + "/api/updateTask/" + id;
  try {
    await axios.put(url, body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  } catch (errorObj) {
    handleAxiosError(errorObj);
  }
}

export {
  getLatestTasksFromServer,
  createNewTask,
  completeTask,
  deleteTask,
  undoTask,
  updateTask,
};
