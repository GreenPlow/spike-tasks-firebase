
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Form, Input, Radio } from "semantic-ui-react";
import { createNewTask } from "../api/taskActions";

function TaskSizeSelector({sizeOptions, selectedSize, onSizeChange}) {
  // The props could be destructed to avoid typing props.
  // may add confusion if coder forgets to do it
  // const { sizeOptions, selectedSize, onSizeChange } = props;

  return (
    <Form.Group inline>
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
  );
}

TaskSizeSelector.propTypes = {
  sizeOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedSize: PropTypes.oneOf(["small", "medium", "large"]).isRequired,
  onSizeChange: PropTypes.func.isRequired
};

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
          tabIndex={1}
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
