/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Card, Header, Form, Input, Icon } from "semantic-ui-react";

function Row(props) {
  const id = props.item._id;
  const task = props.item.task;
  const status = props.item.status;
  let color = "yellow";

  if (status) {
    color = "green";
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

let endpoint = "http://localhost:8000";

async function getLatestTasksFromServer() {
  const res = await axios.get(endpoint + "/api/task")
  return res.data;
}

async function createNewTask (task) {
  const url = endpoint + "/api/task";
  const body = {task};
  await axios.post(url, body, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
}

async function deleteTask (id) {
  const url = endpoint + "/api/deleteTask/" + id;
  await axios.delete(url, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
}

async function undoTask (id) {
  const url = endpoint + "/api/undoTask/" + id;
  await axios.put(url, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
}

async function updateTask (id) {
  const url = endpoint + "/api/task/" + id;
  await axios.put(url, {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
}

export default function TaskList () {
  // state for creating a new task
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([])

  async function getLatestTasksFromServerAndUpdateState() {
    const latestTasks = await getLatestTasksFromServer()
    if (latestTasks) { // TODO: you might not do this if server returns empty array
      setTasks(latestTasks)
    }
  }
  
  useEffect( async () => {
    await getLatestTasksFromServerAndUpdateState();
  }, []);

  function handleNewTask(e) {
    setNewTask(e.target.value);
  }

  async function onSubmit () {
    await createNewTask(newTask);
    await getLatestTasksFromServerAndUpdateState();
    setNewTask('');
  }

  async function onDelete (id) {
    await deleteTask(id);
    await getLatestTasksFromServerAndUpdateState();
  }

  return (
    <div>
      <div>
        <Header className="header" as="h2">
          TASK LIST
        </Header>
      </div>
      <div className="row">
        <Form onSubmit={onSubmit}>
          <Input
            type="text"
            name="task"
            fluid
            placeholder="Create Task"
            value={newTask}
            onChange={handleNewTask}
          />
        </Form>
      </div>
      <div className="row">
        <Card.Group>{tasks.map(item => <Row key={item._id} item={item} />)}</Card.Group>
      </div>
    </div>
  );
}
