/* eslint-disable */
import React from "react";
import { deleteTask, completeTask, undoTask } from "../taskActions";
import { Card, Icon } from "semantic-ui-react";

function Task(props) {
  const id = props.item._id;
  const task = props.item.task;

  // TODO Test the colors lines 15 to 20
  const status = props.item.status;
  let color = "yellow";

  if (status) {
    color = "green";
  }

  async function onDelete(id) {
    await deleteTask(id);
    await props.onModification();
    // await props.onModification();
  }

  async function onDone(id) {
    await completeTask(id);
    await props.onModification();
    // await props.onModification();
  }

  async function onUndo(id) {
    await undoTask(id);
    await props.onModification();
    //   await props.onModification();
  }

  // TODO can we test if the card is fluid?
  // TODO we need to test that the color is passed in
  return (
    <Card fluid key={id} color={color}>
      <Card.Content>
        <Card.Header data-testid="hh" textAlign="left">
          <div style={{ wordWrap: "break-word" }}>{task}</div>
        </Card.Header>
        {
          <Card.Meta textAlign="right">
            <Icon
              name="check circle"
              color="green"
              onClick={() => onDone(id)}
              data-testid="icon-green"
            />
            <span style={{ paddingRight: 10 }}>Done</span>
            <Icon
              name="undo"
              color="yellow"
              onClick={() => onUndo(id)}
              data-testid="icon-yellow"
            />
            <span style={{ paddingRight: 10 }}>Undo</span>
            <Icon
              name="delete"
              color="red"
              onClick={() => onDelete(id)}
              data-testid="icon-red"
            />
            <span style={{ paddingRight: 10 }}>Delete</span>
          </Card.Meta>
        }
      </Card.Content>
    </Card>
  );
}

export default Task;
