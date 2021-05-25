import React from "react";
import Chance from "chance";
import {createTask, deleteTask, updateTask} from "app/api/taskActions";
import {addTask, deleteTaskFromDB, updateTaskFromDB} from "app/api/taskRepository";
import {setAlert} from "app/api/errorMessage";

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

describe("taskActions", () => {
  describe("createTask", () => {
    test("should save task for user", async () => {
      // given a user and an input task
      const doneNotification = jest.fn();
      const task = chance.string();
      const size = chance.string();
      const momentjsObj = chance.string();

      addTask.mockResolvedValue();

      // when I try to create task
      await createTask(
        {
          task: task,
          size: size,
          momentjsObj,
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

      expect(setAlert).toHaveBeenCalledTimes(0);
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

      expect(setAlert).toHaveBeenCalledTimes(0);
      expect(doneNotification).toHaveBeenCalledTimes(1);
    });

    test("should show user error when task is unable to be saved", async () => {
      // given
      const doneNotification = jest.fn();
      const task = chance.string();
      const size = chance.string();
      const startDateTime = chance.string();
      const fakeError = new Error(chance.string());

      addTask.mockRejectedValue(fakeError);

      // when
      await expect(
        () => createTask({task, size, startDateTime}, doneNotification)
      ).rejects.toThrow(fakeError);

      // then
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

      expect(doneNotification).toHaveBeenCalledTimes(0)
    });
  })
  describe("deleteTask", () => {
    test("should delete a task for a user", async () => {
      // given a task Id
      const _id = chance.guid();
      const afterNotification = jest.fn()

      deleteTaskFromDB.mockResolvedValue()

      // when I try to delete a task
      await deleteTask({_id}, afterNotification)

      // then I should
      expect(deleteTaskFromDB).toHaveBeenCalledTimes(1)
      expect(deleteTaskFromDB).toHaveBeenCalledWith(
        expectedUserId, {_id}
      )

      expect(setAlert).toHaveBeenCalledTimes(0)
      expect(afterNotification).toHaveBeenCalledTimes(1)
    })

    test("should throw an error and set an alert if deleting a task fails", async () => {
      // given
      const _id = chance.guid();
      const afterNotification = jest.fn();
      const fakeError = new Error(chance.string());

      deleteTaskFromDB.mockRejectedValue(fakeError);

      // when
      await expect(
        () => deleteTask({_id}, afterNotification)
      ).rejects.toThrow(fakeError);

      // then
      expect(setAlert).toHaveBeenCalledTimes(1);
      expect(setAlert).toHaveBeenCalledWith({
        heading: "Well, this is embarassing...",
        message: (
          <>
            <strong>{_id} </strong>
            {"was not deleted"}
          </>
        ),
      });

      expect(afterNotification).toHaveBeenCalledTimes(0)
    })
  })
  describe("UpdateTask", () => {
    test("should update a task for a user", async () => {
      // given a user and an input task
      const doneNotification = jest.fn();
      const task = chance.string();
      const size = chance.string();
      const momentjsObj = chance.string();

      updateTaskFromDB.mockResolvedValue();

      // when I try to update a task
      await updateTask(
        {
          task: task,
          size: size,
          momentjsObj,
        },
        doneNotification
      );

      // then I should call update for full specified task and notify caller when complete
      expect(updateTaskFromDB).toHaveBeenCalledTimes(1);
      expect(updateTaskFromDB).toHaveBeenCalledWith(expectedUserId, {
        task: task,
        size: size,
        momentjsObj,
      });

      expect(setAlert).toHaveBeenCalledTimes(0);
      expect(doneNotification).toHaveBeenCalledTimes(1);

    })

    test("should throw an error and set an alert if the task fails to update", async () => {
      // give the task object to the repository so it can update the db to match it
      const doneNotification = jest.fn();
      const task = chance.string();
      const size = chance.string();
      const startDateTime = chance.string();
      const fakeError = new Error(chance.string());

      updateTaskFromDB.mockRejectedValue(fakeError);

      // when
      await expect(
        () => updateTask({task, size, startDateTime}, doneNotification)
      ).rejects.toThrow(fakeError);

      // then
      expect(setAlert).toHaveBeenCalledTimes(1);
      expect(setAlert).toHaveBeenCalledWith({
        heading: "Well, this is embarassing...",
        message: (
          <>
            <strong>{task} </strong>
            {"was not updated"}
          </>
        ),
      });

      expect(doneNotification).toHaveBeenCalledTimes(0)
    })
  })
})
