import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import { Form, Button } from "react-bootstrap";

import moment from "moment";

import { updateTask } from "../api/taskActions";

export default function EditTask({ editObj, afterUpdate }) {
  // https://stackoverflow.com/questions/22573494/react-js-input-losing-focus-when-rerendering

  const [task, setTask] = useState(editObj.task);
  // const [date, setDate] = useState(moment(editObj.date).format("L"));
  const [date, setDate] = useState(editObj.date);


  const inputRef = useRef(null);

  function handleEdit(e) {
    console.log(e.target.value);
    setTask(e.target.value);
  }

  function handleDateEdit(e) {
    console.log(e.target.value);
    setDate(e.target.value);
  }

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    await updateTask({ ...editObj, task, date });
    await afterUpdate();
  }

  return (
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
        <Form.Control value={date} onChange={handleDateEdit} />
      </Form.Group>
      <Button variant="primary" type="submit">
        Save
      </Button>
    </Form>
  );
}

EditTask.propTypes = {
  editObj: PropTypes.exact({
    _id: PropTypes.string.isRequired,
    task: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }),
  afterUpdate: PropTypes.func.isRequired,
};
