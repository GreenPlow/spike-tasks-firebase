/* eslint-disable*/

import axios from "axios";
// add the axios interceptors here to do the banners and logging, able to delete the try catches

const endpoint = "http://localhost:8000";

async function getLatestTasksFromServer() {
  const res = await axios.get(endpoint + "/api/task");
  return res.data;
}

// 403, 400, 500, generic catch all
// utility function (a. give me an axios reponse, b, call one of four functions)

function handleAxiosError(error) {
  debugger;
  const errorStatus = error.response.status;
  console.error("attempted api call: ", error.response.config.url);
  switch (errorStatus) {
    case 400:
      console.error("error bad request ", errorStatus);
      break;

    case 403:
      console.error("error access denied: ", errorStatus);
      break;

    case 500:
      console.error("internal server error: ", errorStatus);
      break;

    default:
      console.error("general error: ", errorStatus);
  }

  return errorStatus;
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
