import axios from "axios";

const endpoint = "http://localhost:8000";

async function getLatestTasksFromServer() {
  const res = await axios.get(endpoint + "/api/task")
  return res.data;
}

async function createNewTask (task) {
  const url = endpoint + "/api/task";
  const body = {task};
  await axios.post(url, body, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
}

async function deleteTask (id) {
  const url = endpoint + "/api/deleteTask/" + id;
  await axios.delete(url, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
}

async function undoTask (id) {
  const url = endpoint + "/api/undoTask/" + id;
  await axios.put(url, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
}

async function updateTask (id) {
  const url = endpoint + "/api/task/" + id;
  await axios.put(url, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
}

export {getLatestTasksFromServer, createNewTask, deleteTask, undoTask, updateTask}

// https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export

// is using module exports a node practice?
// module.exports = {}