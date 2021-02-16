import React, { useState } from "react";
import PropTypes from "prop-types";

import {
  completeTask,
  deleteTask,
  undoTask,
  updateTask,
} from "../api/taskActions";
import { Card, Icon, Input, Form } from "semantic-ui-react";

function EditWindow({ editObj, handleEdit, afterUpdate }) {
  // https://stackoverflow.com/questions/22573494/react-js-input-losing-focus-when-rerendering

  // The state of task is managed in the other component..
  async function onSubmit() {
    await updateTask(editObj);
    await afterUpdate();
  }

  return (
    <Form onSubmit={onSubmit}>
      <Input label="edit" value={editObj.task} onChange={handleEdit} />
    </Form>
  );
}

EditWindow.propTypes = {
  editObj: PropTypes.exact({
    _id: PropTypes.string.isRequired,
    task: PropTypes.string.isRequired,
  }),
  handleEdit: PropTypes.func.isRequired,
  afterUpdate: PropTypes.func.isRequired,
};

function Task({ taskObj, onModification }) {
  const { _id, task, status, tasksize } = taskObj;

  const [thisTask, setTask] = useState(task);

  let color = "yellow";

  if (status) {
    color = "green";
  }

  async function onDelete() {
    await deleteTask(_id);
    await onModification();
  }

  async function onDone() {
    await completeTask(_id);
    await onModification();
  }

  async function onUndo() {
    await undoTask(_id);
    await onModification();
  }

  function handleEdit(e) {
    // sets the hook and line 54-56 occurs before re-render occurs
    setTask(e.target.value);
    // console.log() instance A of task, then re-invokes line 27 to get the latest update and will console.log() instance B of task
  }

  const [showEdit, setShowEdit] = useState(false);

  // TODO can we test if the card is fluid?
  // TODO we need to test that the color is passed in
  return (
    <Card key={_id} color={color} fluid draggable>
      <Card.Content>
        <Card.Header textAlign="left" onClick={() => setShowEdit(true)}>
          {!showEdit ? (
            <div style={{ wordWrap: "break-word" }}>{thisTask}</div>
          ) : null}
          {!showEdit ? (
            <div style={{ wordWrap: "break-word" }}>{tasksize}</div>
          ) : null}
          {showEdit ? (
            <EditWindow
              editObj={{ task: thisTask, _id: _id }}
              handleEdit={handleEdit}
              afterUpdate={() => {
                setShowEdit(false);
                onModification();
              }}
            />
          ) : null}
        </Card.Header>
        <Card.Meta textAlign="right">
          <Icon name="check circle" color="green" onClick={() => onDone()} />
          <span style={{ paddingRight: 10 }}>Done</span>
          <Icon name="undo" color="yellow" onClick={() => onUndo()} />
          <span style={{ paddingRight: 10 }}>Undo</span>
          <Icon name="delete" color="red" onClick={() => onDelete()} />
          <span style={{ paddingRight: 10 }}>Delete</span>
        </Card.Meta>
      </Card.Content>
    </Card>
  );
}

Task.propTypes = {
  taskObj: PropTypes.exact({
    _id: PropTypes.string.isRequired,
    task: PropTypes.string.isRequired,
    status: PropTypes.bool.isRequired,
    tasksize: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired
  }),
  onModification: PropTypes.func.isRequired,
};

export default Task;

// 1 test for the structure: assert is a card, icons, header
// one test for each action and that they call their action creator properly
// 2 tests for either status color
