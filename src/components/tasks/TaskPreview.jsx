import React, { useState } from 'react';
import PropTypes from 'prop-types';
import taskObjPropTypes from 'components/common/propTypes';

import { Card, Button } from 'react-bootstrap';
import { Icon } from 'semantic-ui-react';
import { SizeSelector } from 'components/common/SizeSelector';

import moment from 'moment';

import { deleteTask, patchTask } from 'app/api/taskActions';

export default function TaskPreview({
  taskObj,
  onClick,
  onModification,
  styleAttributes,
}) {
  const {
    id, task, size, startDateTime,
  } = taskObj;
  const { cardBorderColor, toggleDoneButton } = styleAttributes;
  const [statefulTaskSize, setStatefulTaskSize] = useState(size);

  async function onDelete(e) {
    e.stopPropagation();
    await deleteTask({ id }, async () => {
      await onModification();
    });
  }

  async function onDone(e) {
    e.stopPropagation();
    await patchTask({ id, property: { status: true } }, async () => {
      await onModification();
    });
  }

  async function onUndo(e) {
    e.stopPropagation();
    await patchTask({ id, property: { status: false } }, async () => {
      await onModification();
    });
  }

  async function changeTaskSize(value) {
    await patchTask({ id, property: { size: value } }, async () => {
      await onModification();
      setStatefulTaskSize(value);
    });
  }

  return (
    <Card key={id} border={cardBorderColor} className="my-2">
      <Card.Body textalign="left" onClick={onClick}>
        <Card.Title>{task}</Card.Title>
        <Card.Subtitle>{moment(startDateTime).format('LTS')}</Card.Subtitle>
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
          <SizeSelector
            id={id}
            selectedValue={statefulTaskSize}
            onSizeChangeCallBack={(value) => {
              changeTaskSize(value);
            }}
            styleAttributes={{ position: 'absolute', top: 0, right: 0 }}
          />
        </div>
      </Card.Body>
    </Card>
  );
}

TaskPreview.propTypes = {
  taskObj: taskObjPropTypes.isRequired,
  onModification: PropTypes.func.isRequired,
  styleAttributes: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onClick: PropTypes.func,
};

TaskPreview.defaultProps = {
  styleAttributes: {},
  onClick: () => {},
};
