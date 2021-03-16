import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Accordion, Alert, Card } from "react-bootstrap";
import Task from "./Task";

import { getLatestTasksFromServer } from "../../../api/taskActions";

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
      <>
        <Accordion>
          <Card className="border-0 my-2" style={{ overflow: "visible" }}>
            <Accordion.Toggle className="border" as={Card.Header} eventKey="0">
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
      </>
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
      <>
        <Accordion defaultActiveKey="0">
          <Card className="border-0 my-2" style={{ overflow: "visible" }}>
            <Accordion.Toggle className="border" as={Card.Header} eventKey="0">
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
      </>
    );
  }

  return (
    <>
      {renderCompleteTasks()}
      {renderIncompleteTasks()}
    </>
  );
}

TaskList.propTypes = {
  calendarDate: PropTypes.object.isRequired,
  triggerRender: PropTypes.string,
};
