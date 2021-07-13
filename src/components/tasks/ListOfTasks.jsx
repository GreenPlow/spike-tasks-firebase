import React from 'react';
import PropTypes from 'prop-types';
import taskObjPropTypes from 'components/common/propTypes';

import { Accordion, Alert, Card } from 'react-bootstrap';
import moment from 'moment';

import Task from 'components/tasks/Task';

export default function ListOfTasks({
  cb,
  calendarDate,
  completeTasks,
  incompleteTasks,
}) {
  function renderCompleteTasks() {
    return (
      <>
        <Accordion>
          <Card className="border-0 my-2" style={{ overflow: 'visible' }}>
            <Accordion.Toggle className="border" as={Card.Header} eventKey="0">
              {completeTasks.length}
              {' '}
              Complete!
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <div>
                {completeTasks.map((item) => (
                  <Task key={item.id} taskObj={item} onModification={cb} />
                ))}
              </div>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </>
    );
  }

  function renderIncompleteTasks() {
    if (incompleteTasks === null) {
      return (
        <Alert key="warning" variant="warning" style={{ height: '300px' }}>
          Ooops. There was a problem getting tasks from the CLOUD...
        </Alert>
      );
    }
    if (incompleteTasks.length === 0 && completeTasks.length === 0) {
      return (
        <Alert key="success" variant="info" style={{ height: '300px' }}>
          There are no tasks to display for this day. Try creating one!
        </Alert>
      );
    }

    if (incompleteTasks.length === 0 && completeTasks.length > 0) {
      return (
        <Alert key="success" variant="success" style={{ height: '300px' }}>
          Way to go. You completed all of the tasks for today!
        </Alert>
      );
    }

    return (
      <>
        <Accordion defaultActiveKey="0">
          <Card className="border-0 my-2" style={{ overflow: 'visible' }}>
            <Accordion.Toggle className="border" as={Card.Header} eventKey="0">
              {incompleteTasks.length}
              {' '}
              Tasks left for
              {' '}
              {moment(calendarDate).format('dddd')}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <div>
                {incompleteTasks.map((item) => (
                  <Task
                    key={item.id}
                    taskObj={item}
                    onModification={cb}
                    styleAttributes={{ toggleDoneButton: true }}
                  />
                ))}
              </div>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </>
    );
  }

  return (
    <>
      {completeTasks === undefined || completeTasks.length === 0 ? undefined
        : renderCompleteTasks()}
      {incompleteTasks === undefined ? undefined : renderIncompleteTasks()}
    </>
  );
}

ListOfTasks.propTypes = {
  cb: PropTypes.func.isRequired,
  calendarDate: PropTypes.instanceOf(moment).isRequired,
  completeTasks: PropTypes.arrayOf(taskObjPropTypes),
  incompleteTasks: PropTypes.arrayOf(taskObjPropTypes),
};

ListOfTasks.defaultProps = {
  completeTasks: [],
  incompleteTasks: [],
};
