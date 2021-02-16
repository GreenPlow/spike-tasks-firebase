import React, { useState } from "react";
import PropTypes from "prop-types";
import { Form, Input, Radio } from "semantic-ui-react";
import { createNewTask } from "../api/taskActions";

function TaskSizeSelector({
  sizeOptions,
  selectedSize,
  onSizeChange,
  errorMessage,
}) {
  function Alert() {
    return (
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
        {errorMessage}
      </p>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      {errorMessage ? <Alert /> : null}
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
              name={sizeOption}
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
  selectedSize: PropTypes.oneOf(["small", "medium", "large", ""]).isRequired,
  onSizeChange: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};

function NewTask({ onCreateFinish, dateObj }) {
  const [newTask, setNewTask] = useState("");
  const [newTaskSize, setNewTaskSize] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function cb_onSizeChange(size) {
    setNewTaskSize(size);
  }

  async function onSubmit() {
    if (newTaskSize.length === 0) {
      console.log("inside onSubmit()");
      console.log(newTaskSize);
    } else {
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
    <div className="row">
      <Form onSubmit={onSubmit}>
        <Input
          tabIndex={1}
          fluid
          type="text"
          name="task"
          placeholder="Create Task"
          value={newTask}
          onChange={(e) => {
            setNewTask(e.target.value);
          }}
        />
        <TaskSizeSelector
          sizeOptions={["small", "medium", "large"]}
          onSizeChange={cb_onSizeChange}
          selectedSize={newTaskSize}
          errorMessage={errorMessage}
        />
        {errorMessage ? <text>{errorMessage}</text> : null}
      </Form>
    </div>
  );
}

NewTask.propTypes = {
  onCreateFinish: PropTypes.func.isRequired,
  dateObj: PropTypes.object,
};

export default NewTask;
