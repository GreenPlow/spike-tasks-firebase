import React from 'react';
import { setAlert } from 'app/api/errorMessage';
import {
  addTask,
  deleteTaskFromDB,
  updateTaskFromDB,
} from 'app/api/taskRepository';
import { firebase } from 'app/config/fire';

const { Timestamp } = firebase.firestore;

export function dataFromSnapshot(snapshot) {
  if (!snapshot.exists) return undefined;
  const data = snapshot.data();

  Object.keys(data).forEach((prop) => {
    if (data[prop] instanceof firebase.firestore.Timestamp) {
      data[prop] = data[prop].toDate();
    }
  });

  return {
    ...data,
    id: snapshot.id,
  };
}

function getCollectionRef() {
  return firebase
    .firestore()
    .collection(`users/${firebase.auth().currentUser.uid}/tasklist`);
}

async function getLatestTasksFromServer({ momentjsObj }) {
  const queryfield = 'startDateTime';

  const query = await getCollectionRef()
    .where(
      queryfield,
      '>=',
      Timestamp.fromDate(momentjsObj.startOf('day').toDate()),
    )
    .where(
      queryfield,
      '<=',
      Timestamp.fromDate(momentjsObj.endOf('day').toDate()),
    )
    .get();

  const docsWithData = query.docs.map((doc) => dataFromSnapshot(doc));
  return docsWithData;
}

async function createTask(input, afterSuccess) {
  try {
    await addTask(firebase.auth().currentUser.uid, {
      ...input,
      status: false,
      size: input.size || null,
    });
    afterSuccess();
  } catch (error) {
    setAlert({
      heading: 'Oh Snap!',
      message: (
        <>
          <strong>
            {input.task}
            {' '}
          </strong>
          was not created...
        </>
      ),
    });
    throw error;
  }
}

async function patchTask({ id, property }, afterSuccess) {
  try {
    await getCollectionRef().doc(id).update(property);
    afterSuccess();
  } catch (errorObj) {
    setAlert({
      heading: 'Oh Snap!',
      message: (
        <>
          <strong>
            {Object.keys(property)[0]}
            {' '}
          </strong>
          was not updated
        </>
      ),
    });
  }
}

async function deleteTask({ id }, afterSuccess) {
  try {
    await deleteTaskFromDB(firebase.auth().currentUser.uid, { id });
    afterSuccess();
  } catch (errorObj) {
    setAlert({
      heading: 'Well, this is embarassing...',
      message: (
        <>
          <strong>
            {id}
            {' '}
          </strong>
          was not deleted
        </>
      ),
    });
    throw errorObj;
  }
}

async function updateTask(taskObj, afterUpdate) {
  const { task } = taskObj;

  try {
    await updateTaskFromDB(firebase.auth().currentUser.uid, taskObj);
    afterUpdate();
  } catch (errorObj) {
    setAlert({
      heading: 'Well, this is embarassing...',
      message: (
        <>
          <strong>
            {task}
            {' '}
          </strong>
          was not updated
        </>
      ),
    });
    throw errorObj;
  }
}

export {
  getLatestTasksFromServer,
  createTask,
  deleteTask,
  updateTask,
  patchTask,
};
