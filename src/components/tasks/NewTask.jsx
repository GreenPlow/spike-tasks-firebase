import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  InputGroup, FormControl,
} from 'react-bootstrap';

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
      <InputGroup>
        <FormControl
          tabIndex={1}
          type="text"
          name="task"
          placeholder="Create Task"
          value={task}
          onChange={(e) => {
            setTask(e.target.value);
          }}
        />
        <InputGroup.Append>
          <SizeSelector
            onSizeChange={(value) => {
              onSubmit(value);
            }}
            disabled={isTaskNameEmpty}
          />
        </InputGroup.Append>
      </InputGroup>

    </>
  );
}

NewTask.propTypes = {
  onCreateFinish: PropTypes.func.isRequired,
  momentjsObj: PropTypes.object,
};

export default NewTask;
