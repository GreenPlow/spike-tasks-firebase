import React, { useState } from "react";
import PropTypes from "prop-types";

import { Card, ToggleButtonGroup, ToggleButton, Button } from "react-bootstrap";
import { Icon } from "semantic-ui-react";
import EditTask from "./EditTask";

import moment from "moment";

import { deleteTask, patchTask } from "../../../api/taskActions";
import { setAlert } from "../../../errorMessage";

function Task({ taskObj, onModification, doneButton }) {
  const { _id, task, status, taskSize, date } = taskObj;
  const [statefulTaskSize, setStatefulTaskSize] = useState([taskSize]);

  let color = "warning";

  if (status) {
    color = "success";
  }

  async function onDelete(e) {
    e.stopPropagation();
    await deleteTask(_id);
    await onModification();
  }

  async function onDone(e) {
    e.stopPropagation();
    await patchTask({ _id, property: { status: true } }, async () => {
      await onModification();
      setAlert("");
    });
  }

  async function onUndo(e) {
    e.stopPropagation();
    await patchTask({ _id, property: { status: false } }, async () => {
      await onModification();
      setAlert("");
    });
  }

  async function changeTaskSize(value) {
    await patchTask({ _id, property: { taskSize: value } }, async () => {
      await onModification();
      setStatefulTaskSize(value);
      setAlert("");
    });
  }

  const [showEdit, setShowEdit] = useState(false);

  // TODO can we test if the card is fluid?
  // TODO we need to test that the color is passed in

  // probably need to go to managed state so the button on the screen doesn't change until the server updates
  return (
    <Card key={_id} border={color} className="my-2">
      {showEdit ? (
        <Card.Body textalign="left">
          <EditTask
            editObj={taskObj}
            afterUpdate={() => {
              onModification();
              setShowEdit(false);
            }}
            handleCancel={() => {
              setShowEdit(false);
            }}
          />
        </Card.Body>
      ) : null}
      {!showEdit ? (
        <>
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
          <Card.Body textalign="left" onClick={() => setShowEdit(true)}>
            <Card.Title>{task}</Card.Title>
            <Card.Subtitle>{moment(date).format("LTS")}</Card.Subtitle>
            <Card.Text className="d-inline-flex">
              {doneButton ? (
                <>
                  <Button variant="link" onClick={(e) => onDone(e)}>
                    <Icon name="check circle" color="green" />
                    Done
                  </Button>
                  <Button variant="link" onClick={(e) => onDelete(e)}>
                    <Icon name="delete" color="red" />
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="link" onClick={(e) => onUndo(e)}>
                    <Icon name="undo" color="yellow" />
                    Undo
                  </Button>
                  <Button variant="link" onClick={(e) => onDelete(e)}>
                    <Icon name="delete" color="red" />
                    Delete
                  </Button>
                </>
              )}
            </Card.Text>
          </Card.Body>
        </>
      ) : null}
    </Card>
  );
}

Task.propTypes = {
  taskObj: PropTypes.exact({
    _id: PropTypes.string.isRequired,
    task: PropTypes.string.isRequired,
    status: PropTypes.bool.isRequired,
    taskSize: PropTypes.string.isRequired,
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
