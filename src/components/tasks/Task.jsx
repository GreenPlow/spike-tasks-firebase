import React, { useState } from "react";
import PropTypes from "prop-types";

import Edit from "components/tasks/Edit";
import Preview from "components/tasks/Preview";

function Task({ taskObj, onModification, styleAttributes }) {
  const { status } = taskObj;
  const [showEdit, setShowEdit] = useState(false);

  let color = "warning";

  if (status) {
    color = "success";
  }

  return (
    <>
      {showEdit ? (
        <Edit
          styleAttributes={{ ...styleAttributes, color }}
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
        <Preview
          color={color}
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
};

export default Task;

// 1 test for the structure: assert is a card, icons, header
// one test for each action and that they call their action creator properly
// 2 tests for either status color
// <Card.Text>{tasksize}</Card.Text>
