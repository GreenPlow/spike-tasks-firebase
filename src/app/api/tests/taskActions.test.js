import React from "react";
import Chance from "chance";
import { createTask } from "app/api/taskActions";
import { addTask } from "app/api/taskRepository";
import { setAlert } from "app/api/errorMessage";

const chance = new Chance();

const expectedUserId = "horse";

jest.mock("../errorMessage");
jest.mock("../taskRepository");
jest.mock("../../config/fire", () => {
  const actualModule = jest.requireActual("app/config/fire");
  return {
    firebase: {
      auth: () => {
        return {
          currentUser: {
            uid: expectedUserId,
          },
        };
      },
      firestore: actualModule.firebase.firestore,
    },
  };
});

test("should save task for user", async () => {
  // given a user and an input tasks
  const doneNotification = jest.fn();
  const task = chance.string();
  const size = chance.string();
  const momentjsObj = chance.string();

  addTask.mockResolvedValue();

  // setup user?
  // firebase.auth().currentUser.uid

  // when I try to create task
  await createTask(
    {
      task: task,
      size: size,
      momentjsObj: momentjsObj,
    },
    doneNotification
  );

  // then I should call create for full specified task and notify caller when complete
  expect(addTask).toHaveBeenCalledTimes(1);
  expect(addTask).toHaveBeenCalledWith(expectedUserId, {
    task: task,
    size: size,
    momentjsObj,
    status: false,
  });
  expect(doneNotification).toHaveBeenCalledTimes(1);
});

test("should save task without size for user", async () => {
  // given
  const doneNotification = jest.fn();
  const task = chance.string();
  const size = undefined;
  const momentjsObj = chance.string();

  addTask.mockResolvedValue();

  // when
  await createTask(
    {
      task: task,
      size: size,
      momentjsObj,
    },
    doneNotification
  );

  // then
  expect(addTask).toHaveBeenCalledTimes(1);
  expect(addTask).toHaveBeenCalledWith(expectedUserId, {
    task: task,
    size: null,
    momentjsObj,
    status: false,
  });
});

test("should show user error when task is unable to be saved", async () => {
  // given
  const doneNotification = jest.fn();
  const task = chance.string();
  const size = chance.string();
  const startDateTime = chance.string();

  const testError = new Error();
  addTask.mockRejectedValue(testError);

  // when
  try {
    await createTask(
      {
        task,
        size,
        startDateTime,
      },
      doneNotification
    );
    expect(true).toBe(false);
  } catch (error) {
    expect(setAlert).toHaveBeenCalledTimes(1);
    expect(setAlert).toHaveBeenCalledWith({
      heading: "Oh Snap!",
      message: (
        <>
          <strong>{task} </strong>
          {"was not created..."}
        </>
      ),
    });
    expect(error).toBe(testError);
  }
});

// TODO - This test works if a new Error(error) is thrown, but has less clarity compare to initial error
// await expect(
//   createTask(
//     {
//       task,
//       size,
//       startDateTime,
//     },
//     doneNotification
//   )
// ).rejects.toThrow();
// expect(setAlert).toHaveBeenCalledTimes(1);
// expect(setAlert).toHaveBeenCalledWith({
//   heading: "Oh Snap!",
//   message: (
//     <>
//       <strong>{task} </strong>
//       {"was not created..."}
//     </>
//   ),
// });
