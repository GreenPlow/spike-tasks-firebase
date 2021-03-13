import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Accordion, Alert, Card } from "react-bootstrap";
import Task from "./Task";

import { getLatestTasksFromServer } from "../../../api/taskActions";
import "./TaskList.css";

import moment from "moment";

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

  function renderCompleteTasks() {
    if (completeTasks === undefined || completeTasks.length === 0) {
      return;
    }

    return (
      <div className="list">
        <Accordion>
          <Card style={{ overflow: "visible" }}>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              {completeTasks.length} Complete!
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <div>
                {completeTasks.map((item) => (
                  <Task
                    key={item._id}
                    taskObj={item}
                    onModification={() => {
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

  function renderIncompleteTasks() {
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
    if (incompleteTasks.length === 0 && completeTasks.length === 0) {
      return (
        <Alert key="success" variant="info" style={{ height: "300px" }}>
          There are no tasks to display for this day. Try creating one!
        </Alert>
      );
    }

    if (incompleteTasks.length === 0 && completeTasks.length > 0) {
      return (
        <Alert key="success" variant="success" style={{ height: "300px" }}>
          Way to go. You completed all of the tasks for today!
        </Alert>
      );
    }

    return (
      <div className="list">
        <Accordion defaultActiveKey="0">
          <Card style={{ overflow: "visible" }}>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              {incompleteTasks.length} Tasks left for{" "}
              {moment(calendarDate).format("dddd")}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <div>
                {incompleteTasks.map((item) => (
                  <Task
                    key={item._id}
                    taskObj={item}
                    onModification={() => {
                      getLatestTasksFromServerAndUpdateState(calendarDate);
                    }}
                    doneButton={true}
                  />
                ))}
              </div>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    );
  }

  return (
    <div>
      {renderCompleteTasks()}
      {renderIncompleteTasks()}
    </div>
  );
}

TaskList.propTypes = {
  calendarDate: PropTypes.object.isRequired,
  triggerRender: PropTypes.string,
};
