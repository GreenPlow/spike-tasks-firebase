import {firebase} from "app/config/fire";
import moment from "moment";

const Timestamp = firebase.firestore.Timestamp;
const FieldValue = firebase.firestore.FieldValue;

// not a behavior
// update the database with the object that firebase expects
function transformForFirebase(data) {
  // TODO this got around the firebase error, but hard to tell how the objects are different
  for (const prop in data) {
    if (Object.prototype.hasOwnProperty.call(data, prop)) {
      if (data[prop] instanceof moment) {
        data[prop] = Timestamp.fromDate(data[prop].toDate());
      }
    }
  }
  return data;
}

async function addTask(user, taskObj) {
  const ref = firebase.firestore().collection(`users/${user}/tasklist`);
  await ref.add({
    ...taskObj,
    startDateTime: Timestamp.fromDate(taskObj.startDateTime.toDate()),
    createdAt: FieldValue.serverTimestamp(),
  });
}

async function deleteTaskFromDB(user, {_id}) {
  const ref = firebase.firestore().collection(`users/${user}/tasklist`);
  await ref.doc(_id).delete()
}

async function updateTaskFromDB(user, taskObj) {
  const transformedObj = transformForFirebase(taskObj);
  const ref = firebase.firestore().collection(`users/${user}/tasklist`);
  // This is writing the _id back to the document when it was not previously there
  const deepCopy = {...transformedObj};
  delete deepCopy._id;
  await ref.doc(transformedObj._id).update(deepCopy);
}

export {addTask, deleteTaskFromDB, updateTaskFromDB};
