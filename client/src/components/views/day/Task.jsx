import React, { useState } from "react";
import PropTypes from "prop-types";

import Card from "react-bootstrap/Card";
import { Icon } from "semantic-ui-react";

import moment from "moment";

import { completeTask, deleteTask, undoTask } from "../../../api/taskActions";
import EditTask from "./EditTask";

function Task({ taskObj, onModification, calendarDate }) {
  const { _id, task, status, tasksize, date } = taskObj;

  let color = "yellow";

  if (status) {
    color = "green";
  }

  async function onDelete() {
    await deleteTask(_id);
    await onModification(calendarDate);
  }

  async function onDone() {
    await completeTask(_id);
    await onModification(calendarDate);
  }

  async function onUndo() {
    await undoTask(_id);
    await onModification(calendarDate);
  }

  const [showEdit, setShowEdit] = useState(false);

  // TODO can we test if the card is fluid?
  // TODO we need to test that the color is passed in
  return (
    <Card key={_id} color={color}>
      <Card.Body textalign="left" onClick={() => setShowEdit(true)}>
        {!showEdit ? (
          <div>
            <Card.Title>{task}</Card.Title>
            <Card.Subtitle>{moment(date).format("LTS")}</Card.Subtitle>
            <Card.Text>{tasksize}</Card.Text>
            <Card.Text textalign="right">
              <Icon
                name="check circle"
                color="green"
                onClick={() => onDone()}
              />
              <span style={{ paddingRight: 10 }}>Done</span>
              <Icon name="undo" color="yellow" onClick={() => onUndo()} />
              <span style={{ paddingRight: 10 }}>Undo</span>
              <Icon name="delete" color="red" onClick={() => onDelete()} />
              <span style={{ paddingRight: 10 }}>Delete</span>
            </Card.Text>
          </div>
        ) : null}
        {showEdit ? (
          <EditTask
            editObj={taskObj}
            afterUpdate={() => {
              setShowEdit(false);
              onModification(calendarDate);
            }}
          />
        ) : null}
      </Card.Body>
    </Card>
  );
}

Task.propTypes = {
  taskObj: PropTypes.exact({
    _id: PropTypes.string.isRequired,
    task: PropTypes.string.isRequired,
    status: PropTypes.bool.isRequired,
    tasksize: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }),
  onModification: PropTypes.func.isRequired,
  calendarDate: PropTypes.object,
};

export default Task;

// 1 test for the structure: assert is a card, icons, header
// one test for each action and that they call their action creator properly
// 2 tests for either status color