/* eslint-disable */
import React from 'react';
import {
  deleteTask,
  completeTask
} from "../taskActions"
import { Card, Icon } from "semantic-ui-react";

function Task(props) {
    const id = props.item._id;
    const task = props.item.task;
    const status = props.item.status;
    let color = "yellow";
  
    if (status) {
      color = "green";
    }

    async function onDelete (id) {
      await deleteTask(id);
      await props.onModification();
    }

    async function onDone (id) {
      await completeTask(id);
      await props.onModification();
    }
  
    return (
      <Card key={id} color={color} fluid>
        <Card.Content>
          <Card.Header textAlign="left">
            <div style={{ wordWrap: "break-word" }}>{task}</div>
          </Card.Header>
          <Card.Meta textAlign="right">
            <Icon
              name="check circle"
              color="green"
              onClick={() => onDone(id)}
            />
            <span style={{ paddingRight: 10 }}>Done</span>
            <Icon
              name="undo"
              color="yellow"
            />
            <span style={{ paddingRight: 10 }}>Undo</span>
            <Icon
              name="delete"
              color="red"
              onClick={() => onDelete(id)}
            />
            <span style={{ paddingRight: 10 }}>Delete</span>
          </Card.Meta>
        </Card.Content>
      </Card>
    );
  }

  export default Task;