import React, { useState } from "react";
import PropTypes from "prop-types";

import { Card, ToggleButtonGroup, ToggleButton, Button } from "react-bootstrap";
import { Icon } from "semantic-ui-react";

import moment from "moment";

import { deleteTask, patchTask } from "app/api/taskActions";

export default function Preview({
  taskObj,
  onClick,
  onModification,
  styleAttributes,
}) {
  const { _id, task, size, startDateTime } = taskObj;
  const { color, toggleDoneButton } = styleAttributes;
  const [statefulTaskSize, setStatefulTaskSize] = useState([size]);

  async function onDelete(e) {
    e.stopPropagation();
    await deleteTask({ _id }, async () => {
      await onModification();
    });
  }

  async function onDone(e) {
    e.stopPropagation();
    await patchTask({ _id, property: { status: true } }, async () => {
      await onModification();
    });
  }

  async function onUndo(e) {
    e.stopPropagation();
    await patchTask({ _id, property: { status: false } }, async () => {
      await onModification();
    });
  }

  async function changeTaskSize(value) {
    await patchTask({ _id, property: { size: value } }, async () => {
      await onModification();
      setStatefulTaskSize(value);
    });
  }

  return (
    <Card key={_id} border={color} className="my-2">
      <Card.Body textalign="left" onClick={onClick}>
        <Card.Title>{task}</Card.Title>
        <Card.Subtitle>{moment(startDateTime).format("LTS")}</Card.Subtitle>
        <Card.Text className="d-inline-flex">
          {toggleDoneButton ? (
            <Button variant="link" onClick={(e) => onDone(e)}>
              <Icon name="check circle" color="green" />
              Done
            </Button>
          ) : (
            <Button variant="link" onClick={(e) => onUndo(e)}>
              <Icon name="undo" color="yellow" />
              Undo
            </Button>
          )}
          <Button variant="link" onClick={(e) => onDelete(e)}>
            <Icon name="delete" color="red" />
            Delete
          </Button>
        </Card.Text>
        <div className="d-flex justify-content-end">
          <ToggleButtonGroup
            type="radio"
            name="options"
            value={statefulTaskSize}
            style={{ position: "absolute", top: 0, right: 0 }}
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
      </Card.Body>
    </Card>
  );
}

Preview.propTypes = {
  taskObj: PropTypes.exact({
    _id: PropTypes.string.isRequired,
    task: PropTypes.string.isRequired,
    status: PropTypes.bool.isRequired,
    size: PropTypes.string.isRequired,
    startDateTime: PropTypes.object.isRequired,
    createdAt: PropTypes.object,
  }),
  onModification: PropTypes.func.isRequired,
  styleAttributes: PropTypes.object,
  onClick: PropTypes.func,
};
