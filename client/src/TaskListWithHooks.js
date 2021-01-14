/* eslint-disable */
import Task from "./Task"
import {
  createNewTask, 
  getLatestTasksFromServer, 
} from "./taskActions"
import React, { useState, useEffect } from 'react';
import "./TaskListWithHooks.css";
import { Card, Header, Form, Input } from "semantic-ui-react";

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
  
  useEffect(() => {
    async function getLatest() {
      await getLatestTasksFromServerAndUpdateState();
    }

    getLatest();
  }, []);

  function handleNewTask(e) {
    setNewTask(e.target.value);
  }

  async function onSubmit () {
    await createNewTask(newTask);
    await getLatestTasksFromServerAndUpdateState();
    setNewTask('');
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
      <div className="list-div">
        <Card.Group>{tasks.map(item => <Task key={item._id} item={item} onModification={getLatestTasksFromServerAndUpdateState} />)}</Card.Group>
      </div>
    </div>
  );
}
