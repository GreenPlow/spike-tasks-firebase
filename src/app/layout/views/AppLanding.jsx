import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Col,
  Nav, NavDropdown,
  Row,
} from 'react-bootstrap';

import { SingleDatePicker } from 'react-dates';
import 'react-dates/initialize';

import moment from 'moment';

import AlertDismissible from 'components/common/AlertDismissible';
import ListOfTasks from 'components/tasks/ListOfTasks';
import NewTask from 'components/tasks/NewTask';
import Time from 'components/common/Time';

import { init } from 'app/api/errorMessage';
import { firebase } from 'app/config/fire';

import { getLatestTasksFromServer } from 'app/api/taskActions';

function separateTasks({ latestTasks }) {
  const complete = [];
  const incomplete = [];
  for (let i = 0; i < latestTasks.length; i += 1) {
    if (latestTasks[i].status === true) {
      complete.push(latestTasks[i]);
    } else {
      incomplete.push(latestTasks[i]);
    }
  }
  return {
    complete,
    incomplete,
  };
}

export default function AppLanding({ cbSetUser }) {
  const [calendarDate, setCalendarDate] = useState(moment());
  const [isFocused, setFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [incompleteTasks, setIncompleteTasks] = useState();
  const [completeTasks, setCompleteTasks] = useState();

  init(setErrorMessage);

  async function getLatestTasksFromServerAndUpdateState(date) {
    try {
      const latestTasks = await getLatestTasksFromServer({
        momentjsObj: date,
      });
      return separateTasks({ latestTasks });
    } catch (error) {
      setIncompleteTasks(null);
      throw error;
    }
  }

  async function today() {
    const {
      complete,
      incomplete,
    } = await getLatestTasksFromServerAndUpdateState(moment());
    setCompleteTasks(complete);
    setIncompleteTasks(incomplete);
    setCalendarDate(moment());
  }

  async function nextDay() {
    const {
      complete,
      incomplete,
    } = await getLatestTasksFromServerAndUpdateState(
      calendarDate.clone().add(1, 'days'),
    );
    setCompleteTasks(complete);
    setIncompleteTasks(incomplete);
    setCalendarDate(calendarDate.clone().add(1, 'days'));
  }

  async function previousDay() {
    const {
      complete,
      incomplete,
    } = await getLatestTasksFromServerAndUpdateState(
      calendarDate.clone().subtract(1, 'days'),
    );
    setCompleteTasks(complete);
    setIncompleteTasks(incomplete);
    setCalendarDate(calendarDate.clone().subtract(1, 'days'));
  }

  useEffect(() => {
    async function getLatest() {
      const {
        complete,
        incomplete,
      } = await getLatestTasksFromServerAndUpdateState(calendarDate);
      setCompleteTasks(complete);
      setIncompleteTasks(incomplete);
    }
    getLatest();
  }, [calendarDate]);

  return (
    <>
      <Row>
        <Col fluid className="d-flex justify-content-end">
          <Time />
        </Col>
      </Row>
      <Row>
        <Col lg={4} className="justify-content-end order-lg-2 mb-2">
          <Nav className="justify-content-end">
            <NavDropdown
              id="bg-nested-dropdown"
              title={`Hi ${firebase.auth().currentUser.displayName}!`}
              className="d-flex justify-content-end"
            >
              <NavDropdown.Item onClick={() => {
                // TODO is there any necessary error handling?
                firebase.auth().signOut();
                cbSetUser(undefined);
              }}
              >
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Col>
        <Col md={5} lg={4} className="mb-2">
          <ButtonToolbar
            aria-label="Toolbar with button groups"
          >
            <ButtonGroup className="flex-fill">
              <Button onClick={today}>Today</Button>
              <Button onClick={previousDay}>Previous</Button>
              <SingleDatePicker
                small
                date={calendarDate} // momentPropTypes.momentObj or null
                onDateChange={(date) => setCalendarDate(date)}
                  // PropTypes.func.isRequired
                focused={isFocused} // PropTypes.bool
                onFocusChange={({ focused }) => setFocused(focused)} // PropTypes.func.isRequired
                id="your_unique_id" // PropTypes.string.isRequired //why is this required and what should it be?
                isOutsideRange={() => false}
                numberOfMonths={1}
                withPortal={true} // eslint-disable-line
              />
              <Button onClick={nextDay}>Next</Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
        <Col md={7} lg={4} className="mb-2">
          <NewTask
            momentjsObj={calendarDate}
            onCreateFinish={async () => {
              const {
                complete,
                incomplete,
              } = await getLatestTasksFromServerAndUpdateState(calendarDate);
              setCompleteTasks(complete);
              setIncompleteTasks(incomplete);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <AlertDismissible msgObj={errorMessage} />
        </Col>
      </Row>
      <Row>
        <Col>
          <h1>{calendarDate.format('dddd, MMM Do')}</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <ListOfTasks
            cb={async () => {
              const {
                complete,
                incomplete,
              } = await getLatestTasksFromServerAndUpdateState(calendarDate);
              setCompleteTasks(complete);
              setIncompleteTasks(incomplete);
            }}
            calendarDate={calendarDate}
            completeTasks={completeTasks}
            incompleteTasks={incompleteTasks}
          />
        </Col>
      </Row>
    </>
  );
}

AppLanding.propTypes = {
  cbSetUser: PropTypes.func.isRequired,
};
