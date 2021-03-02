import React, { useState } from "react";
import PropTypes from "prop-types";

import {
  Alert,
  Form,
  ToggleButtonGroup,
  ToggleButton,
  Row,
  Col,
} from "react-bootstrap";

import { createNewTask } from "../../../api/taskActions";

function TaskSizeSelector({ sizeOptions, selectedSize, onSizeChange }) {
  return (
    <ToggleButtonGroup
      className="align-self-end"
      type="radio"
      name="options"
      value={selectedSize}
      onChange={onSizeChange}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {sizeOptions.map((sizeOption, index) => (
        <ToggleButton
          key={`formField${index}`}
          tabIndex={index + 2}
          name={sizeOption}
          label={sizeOption}
          value={sizeOption}
        >
          {sizeOption}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

TaskSizeSelector.propTypes = {
  sizeOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedSize: PropTypes.oneOf(["small", "medium", "large", ""]).isRequired,
  onSizeChange: PropTypes.func.isRequired,
};

function NewTask({ onCreateFinish, dateObj }) {
  const [newTask, setNewTask] = useState("");
  const [newTaskSize, setNewTaskSize] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    console.log(newTaskSize);
    console.log(newTaskSize.length);
    if (newTaskSize.length > 0) {
      console.log("echo2");
      try {
        await createNewTask(newTask, newTaskSize, dateObj.toISOString());
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(error.message);
      }
      // This is a named callback
      await onCreateFinish();
      setNewTask("");
      setNewTaskSize("");
      // TODO this doesnt seem to be breaking the flow
    }
  }

  function cb_onSizeChange(size) {
    setNewTaskSize(size);
  }

  return (
    <div>
      {errorMessage ? (
        <Alert variant="warning">
          There was a problem! <strong>{errorMessage}</strong>
        </Alert>
      ) : (
        <Alert variant="light" />
      )}
      <Form
        className="d-flex"
        onSubmit={(e) => {
          onSubmit(e);
        }}
      >
        <Form.Group className="flex-grow-1">
          <Form.Control
            tabIndex={1}
            type="text"
            name="task"
            placeholder="Create Task"
            value={newTask}
            onChange={(e) => {
              setNewTask(e.target.value);
            }}
          />
          <div className="justify-content-end">
            <ToggleButtonGroup
              type="radio"
              name="options"
              value={newTaskSize}
              onChange={(value) => {
                debugger; //eslint-disable-line
                cb_onSizeChange(value);
                onSubmit();
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <ToggleButton value="small">S</ToggleButton>
              <ToggleButton value="medium">M</ToggleButton>
              <ToggleButton value="large">L</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </Form.Group>
      </Form>
    </div>
  );
}

NewTask.propTypes = {
  onCreateFinish: PropTypes.func.isRequired,
  dateObj: PropTypes.object,
};

export default NewTask;

// <TaskSizeSelector
// sizeOptions={["small", "medium", "large"]}
// onSizeChange={(value) => {
//   console.log("click");
//   setNewTaskSize(value);
//   console.log(newTaskSize)
//   onSubmit()
// }}
// selectedSize={newTaskSize}
// />
