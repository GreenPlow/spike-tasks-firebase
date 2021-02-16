import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Task from "./Task";
import NewTask from "./NewTask";

import { getLatestTasksFromServer } from "../api/taskActions";
import "./TaskList.css";

import { Card } from "semantic-ui-react";

export default function TaskList({ calendarDate }) {
  const [tasks, setTasks] = useState([]);

  async function getLatestTasksFromServerAndUpdateState() {
    const latestTasks = await getLatestTasksFromServer();
    setTasks(latestTasks);
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
      <NewTask
        dateObj={calendarDate}
        onCreateFinish={() => {
          getLatestTasksFromServerAndUpdateState(calendarDate);
        }}
      />
      <div className="list">
        <Card.Group>
          {tasks.map((item) => (
            <Task
              key={item._id}
              taskObj={item}
              onModification={getLatestTasksFromServerAndUpdateState}
            />
          ))}
        </Card.Group>
      </div>
    </div>
  );
}

TaskList.propTypes = {
  calendarDate: PropTypes.object.isRequired,
};
