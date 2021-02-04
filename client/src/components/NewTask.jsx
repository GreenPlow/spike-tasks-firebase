/* eslint-disable*/

import React, { useState } from "react";

import { createNewTask } from "../api/taskActions";

import { Form, Input, Radio } from "semantic-ui-react";

function TaskSizeSelector(props) {
  // The props could be destructed to avoid typing props.
  // may add confusion if coder forgets to do it
  // const { sizeOptions, selectedSize, onSizeChange } = props;

  return (
    <div class="inline fields">
      {props.sizeOptions.map((sizeOption) => (
        <Form.Field>
          <Radio
            name="radioGroup"
            label={sizeOption}
            value={sizeOption}
            checked={sizeOption === props.selectedSize}
            onChange={() => {
              props.onSizeChange(sizeOption);
            }}
          />
        </Form.Field>
      ))}
    </div>
  );
}

function NewTask(props) {
  const [newTask, setNewTask] = useState("");
  const [newTaskSize, setNewTaskSize] = useState("");

  function handleNewTask(e) {
    setNewTask(e.target.value);
  }

  async function onSubmit() {
    await createNewTask(newTask, newTaskSize);
    // This is a named callback
    await props.onCreateFinish();
    setNewTask("")
    setNewTaskSize("");
  }

  function onSizeChange(size) {
    setNewTaskSize(size);
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
      <TaskSizeSelector
        sizeOptions={["small", "medium", "large"]}
        selectedSize={newTaskSize}
        onSizeChange={onSizeChange}
      />
    </div>
  );
}

export default NewTask;
