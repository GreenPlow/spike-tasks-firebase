// src/mocks/handlers.js

import { rest } from "msw";
import { saveTask } from "./db"
const endpoint = "http://localhost:8000";

export const handlers = [
  rest.post(endpoint + "/api/task", (req, res, ctx) => {
    console.log("hello");
    // const { username } = req.body;
    let newTask = {
        _id: 1234,
        ...req.body
    };
    saveTask(newTask)
    return res(
      ctx.json(newTask)
    );
  }),
];
