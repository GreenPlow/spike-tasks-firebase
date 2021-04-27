import { firebase } from "app/config/fire";

const Timestamp = firebase.firestore.Timestamp;
const FieldValue = firebase.firestore.FieldValue;

async function addTask(user, taskObj) {
  const ref = firebase.firestore().collection(`users/${user}/tasklist`);
  await ref.add({
    ...taskObj,
    startDateTime: Timestamp.fromDate(taskObj.startDateTime.toDate()),
    createdAt: FieldValue.serverTimestamp(),
  });
}

export { addTask };
