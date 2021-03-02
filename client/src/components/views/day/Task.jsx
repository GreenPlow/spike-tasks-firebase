import React, { useState } from "react";
import PropTypes from "prop-types";

import { Card, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { Icon } from "semantic-ui-react";
import EditTask from "./EditTask";

import moment from "moment";

import {
  completeTask,
  deleteTask,
  undoTask,
  patchTask,
} from "../../../api/taskActions";

function Task({ taskObj, onModification, doneButton }) {
  const { _id, task, status, tasksize, date } = taskObj;
  const [statefulTaskSize, setStatefulTaskSize] = useState([tasksize]);

  let color = "warning";

  if (status) {
    color = "success";
  }

  async function onDelete() {
    await deleteTask(_id);
    await onModification();
  }

  async function onDone() {
    await completeTask(_id);
    await onModification();
  }

  async function onUndo() {
    await undoTask(_id);
    await onModification();
  }

  async function changeTaskSize(value) {
    console.log("new size", value);
    await patchTask({ _id, property: { taskSize: value } });
    await onModification();

    setStatefulTaskSize(value);
  }

  const [showEdit, setShowEdit] = useState(false);

  // TODO can we test if the card is fluid?
  // TODO we need to test that the color is passed in

  // probably need to go to managed state so the button on the screen doesn't change until the server updates
  return (
    <Card key={_id} border={color}>
      <Card.Body textalign="left">
        {!showEdit ? (
          <div style={{ position: "relative" }}>
            <div onClick={() => setShowEdit(true)}>
              <Card.Title>{task}</Card.Title>
              <Card.Subtitle>{moment(date).format("LTS")}</Card.Subtitle>
              <div className="d-flex justify-content-end">
                <ToggleButtonGroup
                  type="radio"
                  name="options"
                  value={statefulTaskSize}
                  style={{ position: "absolute", top: 0 }}
                  onChange={(value) => {
                    changeTaskSize(value);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <ToggleButton value="small">S</ToggleButton>
                  <ToggleButton value="medium">M</ToggleButton>
                  <ToggleButton value="large">L</ToggleButton>
                </ToggleButtonGroup>
              </div>
            </div>
            <Card.Text textalign="right">
              {doneButton ? (
                <div>
                  <Icon
                    name="check circle"
                    color="green"
                    onClick={() => onDone()}
                  />
                  <span style={{ paddingRight: 10 }}>Done</span>
                  <Icon name="delete" color="red" onClick={() => onDelete()} />
                  <span style={{ paddingRight: 10 }}>Delete</span>
                </div>
              ) : (
                <div>
                  <Icon name="undo" color="yellow" onClick={() => onUndo()} />
                  <span style={{ paddingRight: 10 }}>Undo</span>
                  <Icon name="delete" color="red" onClick={() => onDelete()} />
                  <span style={{ paddingRight: 10 }}>Delete</span>
                </div>
              )}
            </Card.Text>
          </div>
        ) : null}
        {showEdit ? (
          <EditTask
            editObj={taskObj}
            afterUpdate={() => {
              setShowEdit(false);
              onModification();
            }}
            handleCancel={() => {
              setShowEdit(false);
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
  doneButton: PropTypes.bool,
};

export default Task;

// 1 test for the structure: assert is a card, icons, header
// one test for each action and that they call their action creator properly
// 2 tests for either status color
// <Card.Text>{tasksize}</Card.Text>
