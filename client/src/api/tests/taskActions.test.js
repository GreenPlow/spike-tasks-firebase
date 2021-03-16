import Chance from "chance";
import { createNewTask } from "../taskActions";
import { setLocal } from "../../user";
import { getTasks } from "../../mocks/db";

const chance = new Chance();

// jest.mock("../../../../api/taskActions");

jest.mock("../../errorMessage")

test("should post a new object to the API", async () => {
  const testObj = {
    task: chance.string(),
    taskSize: chance.string(),
    date: chance.string(),
  };

  setLocal("horse");

  expect(getTasks().length).toEqual(0);

  await createNewTask(testObj, jest.fn());

  expect(getTasks().length).toEqual(1);
});
