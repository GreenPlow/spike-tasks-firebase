/* eslint-disable*/

import React, { useState } from "react";

import { createNewTask } from "../api/taskActions";

import { Form, Input, Radio } from "semantic-ui-react";


function NewTask(props) {
  const [newTask, setNewTask] = useState("");
  const [newTaskSize, setSize] = useState("");

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
      <Form.Field>
        <Radio
          label="small"
          name="radioGroup"
          value="small"
          checked={newTaskSize === "small"}
          onChange={() => {
            setSize("small");
          }}
        />
      </Form.Field>
      <Form.Field>
        <Radio
          label="medium"
          name="radioGroup"
          value="medium"
          checked={newTaskSize === "medium"}
          onChange={() => {
            setSize("medium");
          }}
        />
      </Form.Field>
      <Form.Field>
        <Radio
          label="large"
          name="radioGroup"
          value="large"
          checked={newTaskSize === "large"}
          onChange={() => {
            setSize("large");
          }}
        />
      </Form.Field>
    </div>
  );
}

export default NewTask;
