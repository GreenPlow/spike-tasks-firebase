/* eslint-disable*/

import React, { useState } from "react";

import { createNewTask } from "../api/taskActions";

import { Form, Input } from "semantic-ui-react";

function NewTask(props) {
  const [newTask, setNewTask] = useState("");

  function handleNewTask(e) {
    setNewTask(e.target.value);
  }

  async function onSubmit() {
    await createNewTask(newTask);
    // This is a named callback
    await props.onCreateFinish();
    setNewTask("");
  }

  return (
    <div className="row">
      <Form onSubmit={onSubmit}>
        <Input
          type="text"
          name="task"
          fluid
          placeholder="Create Task"
          value={newTask}
          onChange={handleNewTask}
        />
      </Form>
    </div>
  );
}

export default NewTask;
