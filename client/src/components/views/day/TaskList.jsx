import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Accordion, Alert, Card } from "react-bootstrap";
import NewTask from "./NewTask";
import Task from "./Task";

import { getLatestTasksFromServer } from "../../../api/taskActions";
import "./TaskList.css";

function seperateTasks({ latestTasks, setCompleteTasks, setIncompleteTasks }) {
  let completeTasks = [];
  let incompleteTasks = [];
  for (let i = 0; i < latestTasks.length; i++) {
    if (latestTasks[i].status === true) {
      completeTasks.push(latestTasks[i]);
    } else {
      incompleteTasks.push(latestTasks[i]);
    }
  }
  setCompleteTasks(completeTasks);
  setIncompleteTasks(incompleteTasks);
}

function renderIncompleteTaskListOrAlert({
  incompleteTasks,
  getLatestTasksFromServerAndUpdateState,
  calendarDate,
}) {
  if (incompleteTasks === undefined) {
    return;
  }
  if (incompleteTasks === null) {
    return (
      <Alert key="warning" variant="warning" style={{ height: "300px" }}>
        Ooops. There was a problem getting tasks from the CLOUD...
      </Alert>
    );
  }
  if (incompleteTasks.length === 0) {
    return (
      <Alert key="success" variant="success" style={{ height: "300px" }}>
        There are no tasks to display for this day. Try creating one!
      </Alert>
    );
  }

  return (
    <div className="list">
      {incompleteTasks.map((item) => (
        <Task
          key={item._id}
          taskObj={item}
          onModification={() => {
            // pass in the function callback as a named prop
            getLatestTasksFromServerAndUpdateState(calendarDate);
          }}
          doneButton={true}
          // move CalendarDate to the context
        />
      ))}
    </div>
  );
}

function renderCompleteTasksList({
  completeTasks,
  getLatestTasksFromServerAndUpdateState,
  calendarDate,
}) {
  return (
    <div className="list">
      <Accordion>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            Complete Tasks! {completeTasks.length}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <div>
              {completeTasks.map((item) => (
                <Task
                  key={item._id}
                  taskObj={item}
                  onModification={() => {
                    // pass in the function callback as a named prop
                    getLatestTasksFromServerAndUpdateState(calendarDate);
                  }}
                />
              ))}
            </div>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
}
export default function TaskList({ calendarDate, triggerRender }) {
  const [incompleteTasks, setIncompleteTasks] = useState();
  const [completeTasks, setCompleteTasks] = useState();

  async function getLatestTasksFromServerAndUpdateState(calendarDate) {
    const dateISOString = calendarDate.toISOString();
    try {
      const latestTasks = await getLatestTasksFromServer(dateISOString);
      seperateTasks({ latestTasks, setCompleteTasks, setIncompleteTasks });
    } catch (error) {
      setIncompleteTasks(null);
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
      {completeTasks === undefined
        ? null
        : completeTasks.length > 0
        ? renderCompleteTasksList({
            completeTasks,
            getLatestTasksFromServerAndUpdateState,
            calendarDate,
          })
        : null}
      {renderIncompleteTaskListOrAlert({
        incompleteTasks,
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
