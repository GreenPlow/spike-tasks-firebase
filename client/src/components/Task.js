/* eslint-disable */
import React, { useState } from "react";
import { deleteTask, completeTask, undoTask, updateTask } from "../taskActions";
import { Card, Icon, Input, Form } from "semantic-ui-react";

function EditWindow(props) {
  // Destructure the props
  const { taskObj, handleEdit } = props;
  console.log("child ", taskObj);

  // The state of task is managed in the other component..

  async function onSubmit() {
    await updateTask(taskObj);
    // We don't need to call the api and re-render the whole list right? Just trigger the dom to rerender to destroy the Editwindow
  }

  return (
    <Form onSubmit={onSubmit}>
      <Input label="edit" value={taskObj.task} onChange={handleEdit} />
    </Form>
  );
}

// https://stackoverflow.com/questions/22573494/react-js-input-losing-focus-when-rerendering

function Task(props) {
  const id = props.item._id;
  const [task, setTask] = useState(props.item.task);
  console.log("parent re-render", task);
  const status = props.item.status;
  let color = "yellow";

  if (status) {
    color = "green";
  }

  async function onDelete(id) {
    await deleteTask(id);
    await props.onModification();
  }

  async function onDone(id) {
    await completeTask(id);
    await props.onModification();
  }

  async function onUndo(id) {
    await undoTask(id);
    await props.onModification();
  }

  function handleEdit(e) {
    // sets the hook and line 55 occurs before re-render occurs
    setTask(e.target.value);
    // console logs instance a of task, then re-invokes line 27 to get the latest update
    console.log("parent ", task);
  }

  const [showEdit, setShowEdit] = useState(false);

  // TODO can we test if the card is fluid?
  // TODO we need to test that the color is passed in
  return (
    <Card key={id} color={color} fluid draggable>
      <Card.Content>
        <Card.Header textAlign="left" onClick={() => setShowEdit(true)}>
          {!showEdit ? (
            <div style={{ wordWrap: "break-word" }}>{task}</div>
          ) : null}
          {showEdit ? (
            <EditWindow taskObj={{ task, id }} handleEdit={handleEdit} />
          ) : null}
        </Card.Header>
        <Card.Meta textAlign="right">
          <Icon name="check circle" color="green" onClick={() => onDone(id)} />
          <span style={{ paddingRight: 10 }}>Done</span>
          <Icon name="undo" color="yellow" onClick={() => onUndo(id)} />
          <span style={{ paddingRight: 10 }}>Undo</span>
          <Icon name="delete" color="red" onClick={() => onDelete(id)} />
          <span style={{ paddingRight: 10 }}>Delete</span>
        </Card.Meta>
      </Card.Content>
    </Card>
  );
}

export default Task;

// 1 test for the structure: assert is a card, icons, header
// one test for each action and that they call their action creator properly
// 2 tests for either status color
