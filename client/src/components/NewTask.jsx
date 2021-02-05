/* eslint-disable*/

import React, { useState, useRef, useEffect } from "react";

import { createNewTask } from "../api/taskActions";

import { Form, Input, Radio } from "semantic-ui-react";

function TaskSizeSelector(props) {
  // The props could be destructed to avoid typing props.
  // may add confusion if coder forgets to do it
  // const { sizeOptions, selectedSize, onSizeChange } = props;

  // Radio siblings need keys
  return (
    <Form.Group inline>
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
    </Form.Group>
  );
}

function NewTask(props) {
  const [newTask, setNewTask] = useState("");
  const [newTaskSize, setNewTaskSize] = useState("");

  function handleNewTask(e) {
    setNewTask(e.target.value);
  }

  function onSizeChange(size) {
    setNewTaskSize(size);
  }

  async function onSubmit() {
    if (newTaskSize.length === 0) {
      console.log("inside onSubmit()");
      console.log(newTaskSize);
    } else {
      await createNewTask(newTask, newTaskSize);
      // This is a named callback
      await props.onCreateFinish();
      setNewTask("");
      setNewTaskSize("");
    }
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
        <TaskSizeSelector
          sizeOptions={["small", "medium", "large"]}
          selectedSize={newTaskSize}
          onSizeChange={onSizeChange}
        />
      </Form>
    </div>
  );
}

export default NewTask;
