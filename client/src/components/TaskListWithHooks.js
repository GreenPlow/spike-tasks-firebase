import React, { useState, useEffect } from 'react';

import Task from "./Task"
import NewTask from "./NewTask"

import { getLatestTasksFromServer } from "../taskActions"
import "./TaskListWithHooks.css";

import { Card } from "semantic-ui-react";

export default function TaskList() {
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

  return (
    // pass in the function callback as a named prop
    <div>
      <NewTask onCreateFinish={getLatestTasksFromServerAndUpdateState} />
      <div className="list">
        <Card.Group>{tasks.map(item => <Task key={item._id} item={item} onModification={getLatestTasksFromServerAndUpdateState} />)}</Card.Group>
      </div>
    </div>
  );
}
