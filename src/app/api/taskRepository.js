import { firebase } from "app/config/fire";

function addTask(user, taskObj) {
  const ref = firebase.firestore().collection(`users/${user}/tasklist`);
  ref.add(taskObj);
}

export { addTask };
