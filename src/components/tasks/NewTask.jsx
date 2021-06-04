import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Form } from 'react-bootstrap';

import { createTask } from 'app/api/taskActions';
import { SizeSelector } from 'components/common/SizeSelector';

function NewTask({ onCreateFinish, momentjsObj }) {
  const [task, setTask] = useState('');
  const isTaskNameEmpty = !task;

  async function onSubmit(size) {
    document.activeElement.blur();

    await createTask({ task, size, startDateTime: momentjsObj }, async () => {
      await onCreateFinish();
      setTask('');
    });
  }

  return (
    <>
      <Form
        className="d-flex"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <Form.Row className="d-flex align-items-center">
          <Form.Group>
            <Form.Control
              tabIndex={1}
              type="text"
              name="task"
              placeholder="Create Task"
              value={task}
              onChange={(e) => {
                setTask(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="justify-content-end">
            <SizeSelector
              onSizeChange={(value) => {
                onSubmit(value);
              }}
              disabled={isTaskNameEmpty}
            />
          </Form.Group>
        </Form.Row>
      </Form>
    </>
  );
}

NewTask.propTypes = {
  onCreateFinish: PropTypes.func.isRequired,
  momentjsObj: PropTypes.object,
};

export default NewTask;
