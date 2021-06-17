import { firebase } from 'app/config/fire';
import moment from 'moment';

const { Timestamp } = firebase.firestore;
const { FieldValue } = firebase.firestore;

// not a behavior
// update the database with the object that firebase expects
function transformForFirebase(data) {
  const transformedData = {};
  Object.keys(data).forEach((prop) => {
    if (data[prop] instanceof moment) {
      transformedData[prop] = Timestamp.fromDate(data[prop].toDate());
    }
  });
  return transformedData;
}

async function addTask(user, taskObj) {
  const ref = firebase.firestore().collection(`users/${user}/tasklist`);
  await ref.add({
    ...taskObj,
    startDateTime: Timestamp.fromDate(taskObj.startDateTime.toDate()),
    createdAt: FieldValue.serverTimestamp(),
  });
}

async function deleteTaskFromDB(user, { id }) {
  const ref = firebase.firestore().collection(`users/${user}/tasklist`);
  await ref.doc(id).delete();
}

async function updateTaskFromDB(user, taskObj) {
  const transformedObj = transformForFirebase(taskObj);
  const ref = firebase.firestore().collection(`users/${user}/tasklist`);
  // the id was being written back to the document when it was not previously there
  const deepCopy = { ...transformedObj };
  delete deepCopy.id;
  await ref.doc(transformedObj.id).update(deepCopy);
}

export { addTask, deleteTaskFromDB, updateTaskFromDB };
