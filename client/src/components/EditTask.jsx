import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

import Form from "react-bootstrap/Form";

import { updateTask } from "../api/taskActions";

export default function EditTask({ editObj, handleEdit, afterUpdate }) {
  // https://stackoverflow.com/questions/22573494/react-js-input-losing-focus-when-rerendering

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, [handleEdit]);

  // The state of task is managed in the other component..
  async function onSubmit(event) {
    event.preventDefault();
    await updateTask(editObj);
    await afterUpdate();
  }

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group>
        <Form.Label>Edit</Form.Label>
        <Form.Control
          value={editObj.task}
          onChange={handleEdit}
          ref={inputRef}
          onFocus={(e) => {
            e.target.select();
          }}
        />
      </Form.Group>
    </Form>
  );
}

EditTask.propTypes = {
  editObj: PropTypes.exact({
    _id: PropTypes.string.isRequired,
    task: PropTypes.string.isRequired,
  }),
  handleEdit: PropTypes.func.isRequired,
  afterUpdate: PropTypes.func.isRequired,
};
