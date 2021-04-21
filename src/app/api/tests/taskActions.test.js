import Chance from "chance";
// import { createNewTask, patchTask } from "../taskActions";
import { createTask } from "app/api/taskActions";

// import { setLocal } from "../../user";
// import { getTasks } from "../../mocks/db";
import { addTask } from "../taskRepository";
import { firebase } from "app/config/fire";

const chance = new Chance();

// jest.mock("../../../../api/taskActions");
jest.mock("../taskRepository");
jest.mock("../../config/fire", () => {
  const actuualModule = jest.requireActual("app/config/fire");
  return {
    firebase: {
      auth: () => {
        console.log("help");
        return {
          currentUser: {
            uid: "horse",
          },
        };
      },
      firestore: actuualModule.firebase.firestore,
    },
  };
});

test("should save task for user", async () => {
  // given a user and an input tasks
  const doneNotification = jest.fn();
  const testObj = {
    task: chance.string(),
    size: chance.string(),
    momentjs: chance.string(),
  };

  // setup user?
  // firebase.auth().currentUser.uid

  // when I tryto create task
  await createTask(testObj, doneNotification);

  // then I shoule call create for full specified task and notify calller when complete
  expect(addTask).toHaveBeenCalledTimes(1);
  expect(doneNotification).toHaveBeenCalledTimes(1);
});

// ("should save task without size for user");

// ("should show user error when task is unable to be saved");
