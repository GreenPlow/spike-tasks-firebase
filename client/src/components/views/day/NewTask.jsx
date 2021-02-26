import React, { useState } from "react";
import PropTypes from "prop-types";

import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import { createNewTask } from "../../../api/taskActions";

function TaskSizeSelector({
  sizeOptions,
  selectedSize,
  onSizeChange,
}) {
  return (
    <div style={{ position: "relative" }}>
      <Form.Group
        inline
        style={{
          "vertical-align": "middle",
          "margin-top": "4px",
          "padding-top": "4px",
        }}
      >
        {sizeOptions.map((sizeOption, index) => (
          <Form.Check
            key={`formField${index}`}
            tabIndex={index + 2}
            type="radio"
            inline
            name={sizeOption}
            label={sizeOption}
            value={sizeOption}
            checked={sizeOption === selectedSize}
            onChange={() => {
              onSizeChange(sizeOption);
            }}
          />
        ))}
      </Form.Group>
    </div>
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

  function cb_onSizeChange(size) {
    setNewTaskSize(size);
  }

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

  return (
    <div>
      {errorMessage ? (
        <Alert variant="warning">There was a problem! <strong>{errorMessage}</strong></Alert>
      ) : (
        <Alert variant="light"/>
      )}
      <Form
        onSubmit={(e) => {
          onSubmit(e);
        }}
      >
        <TaskSizeSelector
          sizeOptions={["small", "medium", "large"]}
          onSizeChange={cb_onSizeChange}
          selectedSize={newTaskSize}
        />
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
      </Form>
    </div>
  );
}

NewTask.propTypes = {
  onCreateFinish: PropTypes.func.isRequired,
  dateObj: PropTypes.object,
};

export default NewTask;
