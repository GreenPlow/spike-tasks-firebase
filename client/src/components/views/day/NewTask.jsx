import React, { useState } from "react";
import PropTypes from "prop-types";

import { Form, ToggleButtonGroup, ToggleButton } from "react-bootstrap";

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
  const isTaskNameEmpty = !newTask;

  async function onSubmit(size) {
    document.activeElement.blur();

    try {
      await createNewTask(newTask, size, dateObj.toISOString());
    } catch (error) {
      console.log(error);
    }
    // This is a named callback
    await onCreateFinish();
    setNewTask("");
    // TODO this doesnt seem to be breaking the flow
  }

  return (
    <>
      <Form
        className="d-flex"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <Form.Row className="d-flex align-items-center">
          <Form.Group>
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
          </Form.Group>
          <Form.Group className="justify-content-end">
            <ToggleButtonGroup
              type="radio"
              name="options"
              value=""
              onChange={(value) => {
                // setNewTaskSize(value);
                onSubmit(value);
              }}
            >
              <ToggleButton value="small" disabled={isTaskNameEmpty}>
                S
              </ToggleButton>
              <ToggleButton value="medium" disabled={isTaskNameEmpty}>
                M
              </ToggleButton>
              <ToggleButton value="large" disabled={isTaskNameEmpty}>
                L
              </ToggleButton>
            </ToggleButtonGroup>
          </Form.Group>
        </Form.Row>
      </Form>
    </>
  );
}

NewTask.propTypes = {
  onCreateFinish: PropTypes.func.isRequired,
  dateObj: PropTypes.object,
};

export default NewTask;
