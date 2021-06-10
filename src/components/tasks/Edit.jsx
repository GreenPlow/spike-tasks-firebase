import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import taskObjPropTypes from 'components/common/propTypes';

import { Card, Form, Button } from 'react-bootstrap';

import { SingleDatePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import moment from 'moment';

import { updateTask } from 'app/api/taskActions';
import { setAlert } from 'app/api/errorMessage';

export default function Edit({ taskObj, afterUpdate, handleCancel }) {
  // https://stackoverflow.com/questions/22573494/react-js-input-losing-focus-when-rerendering

  const [task, setTask] = useState(taskObj.task);
  // const [date, setDate] = useState(moment(editObj.date).format("L"));
  const [date, setDate] = useState(moment(taskObj.startDateTime));
  const [isFocused, setFocused] = useState(false);

  const inputRef = useRef(null);

  function handleEdit(e) {
    setTask(e.target.value);
  }

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    // TODO should date be refactored to startDateTime?
    await updateTask({ ...taskObj, task, startDateTime: date }, async () => {
      await afterUpdate();
      setAlert('');
    });
  }

  let color = 'warning';

  if (taskObj.status) {
    color = 'success';
  }

  return (
    <Card key={taskObj.id} border={color} className="my-2">
      <Card.Body textalign="left">
        <Form onSubmit={onSubmit}>
          <Form.Group controlId="formBasicTask">
            <Form.Label>Edit</Form.Label>
            <Form.Control
              value={task}
              onChange={handleEdit}
              ref={inputRef}
              onFocus={(e) => {
                e.target.select();
              }}
            />
          </Form.Group>
          <Form.Group controlId="formBasicDate">
            <Form.Label>Date</Form.Label>
            <SingleDatePicker
              small
              date={date} // momentPropTypes.momentObj or null
              onDateChange={(date) => setDate(date)} // PropTypes.func.isRequired
              focused={isFocused} // PropTypes.bool
              onFocusChange={({ focused }) => setFocused(focused)} // PropTypes.func.isRequired
              id="your_unique_id" // PropTypes.string.isRequired //why is this required and what should it be?
              isOutsideRange={() => false}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Save
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

Edit.propTypes = {
  taskObj: taskObjPropTypes,
  afterUpdate: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};
