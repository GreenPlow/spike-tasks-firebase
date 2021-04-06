import React from "react";
import {
  getLatestTasksFromServer as getLatestTasksFromServerOG,
  createNewTask as createNewTaskOG,
} from "./taskActions";
import { setAlert } from "../errorMessage";

export async function getLatestTasksFromServer() {
  let result;
  try {
    result = await getLatestTasksFromServerOG.apply(this, arguments);
    setAlert("");
  } catch (err) {
    console.error("failed to get list from server");
    throw err;
  }
  return result;
}

export async function createNewTask() {
  let result;
  try {
    result = await createNewTaskOG.apply(this, arguments);
    setAlert("");
  } catch (err) {
    setAlert({
      heading: "Oh Snap!",
      message: (
        <>
          <strong>{arguments[0]} </strong>
          {"was not created..."}
        </>
      ),
    });
    throw err;
  }
  return result;
}
