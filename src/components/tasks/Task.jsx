import React, { useState } from 'react';
import PropTypes from 'prop-types';
import taskObjPropTypes from 'components/common/propTypes';

import TaskEdit from 'components/tasks/TaskEdit';
import TaskPreview from 'components/tasks/TaskPreview';

export default function Task({ taskObj, onModification, styleAttributes }) {
  const { status } = taskObj;
  const [showEdit, setShowEdit] = useState(false);

  let cardBorderColor = 'warning';

  if (status) {
    cardBorderColor = 'success';
  }

  return (
    <>
      {showEdit ? (
        <TaskEdit
          styleAttributes={{ cardBorderColor }}
          taskObj={taskObj}
          afterUpdate={() => {
            onModification();
            setShowEdit(false);
          }}
          handleCancel={() => {
            setShowEdit(false);
          }}
        />
      ) : (
        <TaskPreview
          styleAttributes={{ ...styleAttributes, cardBorderColor }}
          taskObj={taskObj}
          onClick={() => {
            setShowEdit(true);
          }}
          onModification={() => {
            onModification();
          }}
        />
      )}
    </>
  );
}

Task.propTypes = {
  taskObj: taskObjPropTypes.isRequired,
  onModification: PropTypes.func.isRequired,
  styleAttributes: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

Task.defaultProps = {
  styleAttributes: {},
};

// 1 test for the structure: assert is a card, icons, header
// 1 test for each action and that they call their action creator properly
// 2 tests for either status color
