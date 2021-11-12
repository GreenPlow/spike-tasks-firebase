import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import moment from 'moment';

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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
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
          <SizeSelector
            id="new-task"
            onSizeChangeCallBack={(value) => {
              onSubmit(value);
            }}
            disabled={isTaskNameEmpty}
          />
        </InputGroup>
      </form>
    </>
  );
}

NewTask.propTypes = {
  onCreateFinish: PropTypes.func.isRequired,
  momentjsObj: PropTypes.instanceOf(moment).isRequired,
};

export default NewTask;
