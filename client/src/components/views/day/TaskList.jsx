import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Alert from "react-bootstrap/Alert";

import Task from "./Task";
import NewTask from "./NewTask";

import { getLatestTasksFromServer } from "../../../api/taskActions";
import "./TaskList.css";

function renderTaskListOrAlert({
  tasks,
  getLatestTasksFromServerAndUpdateState,
  calendarDate,
}) {
  if (tasks === undefined) {
    return;
  }
  if (tasks === null) {
    return (
      <Alert key="warning" variant="warning" style={{ height: "300px" }}>
        Ooops. There was a problem getting tasks from the CLOUD...
      </Alert>
    );
  }
  if (tasks.length === 0) {
    return (
      <Alert key="success" variant="success" style={{ height: "300px" }}>
        There are no tasks to display for this day. Try creating one!
      </Alert>
    );
  }

  return (
    <div className="list">
      {tasks.map((item) => (
        <Task
          key={item._id}
          taskObj={item}
          onModification={getLatestTasksFromServerAndUpdateState}
          calendarDate={calendarDate}
        />
      ))}
    </div>
  );
}
export default function TaskList({ calendarDate, triggerRender }) {
  const [tasks, setTasks] = useState();

  async function getLatestTasksFromServerAndUpdateState(aDateObj) {
    const dateISOString = aDateObj.toISOString();

    try {
      const latestTasks = await getLatestTasksFromServer(dateISOString);
      setTasks(latestTasks);
    } catch (error) {
      setTasks(null);
    }
  }

  useEffect(() => {
    async function getLatest() {
      await getLatestTasksFromServerAndUpdateState(calendarDate);
    }

    getLatest();
  }, [calendarDate, triggerRender]);

  return (
    <div>
      <NewTask
        dateObj={calendarDate}
        onCreateFinish={() => {
          // pass in the function callback as a named prop
          getLatestTasksFromServerAndUpdateState(calendarDate);
        }}
      />
      {renderTaskListOrAlert({
        tasks,
        getLatestTasksFromServerAndUpdateState,
        calendarDate,
      })}
    </div>
  );
}

TaskList.propTypes = {
  calendarDate: PropTypes.object.isRequired,
  triggerRender: PropTypes.string,
};
