import React, { useState } from "react";
import PropTypes from "prop-types";
import { taskObjPropTypes } from "components/common/propTypes";

import Edit from "components/tasks/Edit";
import Preview from "components/tasks/Preview";

export default function Task({ taskObj, onModification, styleAttributes }) {
  const { status } = taskObj;
  const [showEdit, setShowEdit] = useState(false);

  let cardBorderColor = "warning";

  if (status) {
    cardBorderColor = "success";
  }

  return (
    <>
      {showEdit ? (
        <Edit
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
        <Preview
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
  taskObj: taskObjPropTypes,
  onModification: PropTypes.func.isRequired,
  styleAttributes: PropTypes.object,
};

// 1 test for the structure: assert is a card, icons, header
// one test for each action and that they call their action creator properly
// 2 tests for either status color
