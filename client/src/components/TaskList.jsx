import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Task from "./Task";
import NewTask from "./NewTask";

import { getLatestTasksFromServer } from "../api/taskActions";
import "./TaskList.css";

import Alert from "react-bootstrap/Alert";
import { Card } from "semantic-ui-react";

export default function TaskList({ calendarDate, triggerRender }) {
  const [tasks, setTasks] = useState([]);
  const [errorAlert, setErrorAlert] = useState(undefined);

  async function getLatestTasksFromServerAndUpdateState(aDateObj) {
    const dateISOString = aDateObj.toISOString();
    try {
      const latestTasks = await getLatestTasksFromServer(dateISOString);
      setErrorAlert(undefined);
      setTasks(latestTasks);
    } catch (e) {
      setErrorAlert(e);
    }
  }

  useEffect(() => {
    async function getLatest() {
      // Why is useEffect needed?
      await getLatestTasksFromServerAndUpdateState(calendarDate);
    }

    getLatest();
  }, [calendarDate, triggerRender]);

  return (
    // pass in the function callback as a named prop
    <div>
      <NewTask
        dateObj={calendarDate}
        onCreateFinish={() => {
          getLatestTasksFromServerAndUpdateState(calendarDate);
        }}
      />
      {errorAlert ? (
        <Alert>Alert! {errorAlert.toString()}</Alert>
      ) : (
        <div className="list">
          <Card.Group>
            {tasks.map((item) => (
              <Task
                key={item._id}
                taskObj={item}
                onModification={getLatestTasksFromServerAndUpdateState}
                calendarDate={calendarDate}
              />
            ))}
          </Card.Group>
        </div>
      )}
    </div>
  );
}

TaskList.propTypes = {
  calendarDate: PropTypes.object.isRequired,
  triggerRender: PropTypes.string,
};

/*Is there a better way to pass the calendar date that will be used for the get new tasks in the onModification call?*/
