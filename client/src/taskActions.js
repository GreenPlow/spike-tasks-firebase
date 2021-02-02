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

async function completeTask (id) {
  const url = endpoint + "/api/completeTask/" + id;
  await axios.put(url, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
}

async function deleteTask (id) {
  const url = endpoint + "/api/deleteTask/" + id;
  await axios.delete(url, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
}

async function undoTask (id) {
  const url = endpoint + "/api/undoTask/" + id;
  await axios.put(url, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
}

async function updateTask (taskObject) {
  const { task, id} = taskObject;
  console.log('update function', id)
  // Does this make sense to seperate these out, should I include id in the body also?
  const body = {task};
  const url = endpoint + "/api/updateTask/" + id;
  await axios.put(url, body, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
}

export {getLatestTasksFromServer, createNewTask, completeTask, deleteTask, undoTask, updateTask}
