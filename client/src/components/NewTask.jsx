
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Form, Input, Radio } from "semantic-ui-react";
import { createNewTask } from "../api/taskActions";

function TaskSizeSelector({sizeOptions, selectedSize, onSizeChange}) {
  // The props could be destructed to avoid typing props.
  // may add confusion if coder forgets to do it
  // const { sizeOptions, selectedSize, onSizeChange } = props;

  return (
    <div style={{ position: "relative" }}>
      <p
        style={{
          position: "absolute",
          "background-color": "red",
          width: "100%",
          "text-align": "right",
          padding: "4px",
          "border-radius": "4px",
        }}
      >
        {props.errorMessage}
      </p>
      <Form.Group
        inline
        style={{
          "vertical-align": "middle",
          "margin-top": "4px",
          "padding-top": "4px",
        }}
      >
      {sizeOptions.map((sizeOption, index) => (
        <Form.Field key={`formField${index}`}>
          <Radio
            tabIndex={index + 2}
            name="radioGroup"
            label={sizeOption}
            value={sizeOption}
            checked={sizeOption === selectedSize}
            onChange={() => {
              onSizeChange(sizeOption);
            }}
          />
        </Form.Field>
      ))}
    </Form.Group>
          </div>
  );
}

TaskSizeSelector.propTypes = {
  sizeOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedSize: PropTypes.oneOf(["small", "medium", "large"]).isRequired,
  onSizeChange: PropTypes.func.isRequired
};

function NewTask({onCreateFinish}) {
  const [newTask, setNewTask] = useState("");
  const [newTaskSize, setNewTaskSize] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      try {
        await createNewTask(newTask, newTaskSize);
      } catch (error) {
        setErrorMessage(error.message);
      }
      // This is a named callback
      await onCreateFinish();
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
          tabIndex={1}
        />
        <TaskSizeSelector
          sizeOptions={["small", "medium", "large"]}
          selectedSize={newTaskSize}
          onSizeChange={onSizeChange}
          errorMessage={errorMessage}
        />
        {errorMessage ? <text>{errorMessage}</text> : null}
      </Form>
    </div>
  );
}

NewTask.propTypes = {
  onCreateFinish: PropTypes.func.isRequired
}

export default NewTask;
