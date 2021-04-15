import React from "react";
import Chance from "chance";

import { render, screen } from "@testing-library/react";
// import Task from "../../tasks/Task";
import Task from "components/tasks/Task";

// TODO is there a better where to import things so the path doesn't easily break?

jest.mock("app/api/taskActions");

// afterEach(cleanup);
const chance = new Chance();

describe("tests for task component", () => {
  const itemId = chance.string({ pool: "1234567890" });
  const testTaskObj = {
    _id: itemId,
    task: chance.string(),
    status: chance.bool(),
    size: chance.pickone(["small", "medium", "large"]),
    startDateTime: { test: chance.date().toString() },
  };

  it("renders a task provided by props", () => {
    // TODO do I need to use a jest function to pass to onModification?
    render(<Task taskObj={testTaskObj} onModification={jest.fn()} />);
    // render returns a container, a base element, debug
    // container.firstChild.firstChild

    // TODO I think in the TaskList.test.js file we need to mock the server call here and return json to then simulate the await
    const task = screen.getByText(testTaskObj.task);

    expect(task).toHaveTextContent(testTaskObj.task);
  });
});
