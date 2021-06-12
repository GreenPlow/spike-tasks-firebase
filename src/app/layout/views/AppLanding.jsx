import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import DropdownItem from 'react-bootstrap/DropdownItem';
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Col,
  DropdownButton, Nav, NavDropdown,
  Row,
} from 'react-bootstrap';

import { SingleDatePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import moment from 'moment';

import AlertDismissible from 'components/common/AlertDismissible';
import ListOfTasks from 'components/tasks/ListOfTasks';
import NewTask from 'components/tasks/NewTask';
import Time from 'components/common/Time';

import { init } from 'app/api/errorMessage';
import { firebase } from 'app/config/fire';

import { getLatestTasksFromServer } from 'app/api/taskActions';

function seperateTasks({ latestTasks }) {
  console.log(latestTasks);
  const completeTasks = [];
  const incompleteTasks = [];
  for (let i = 0; i < latestTasks.length; i += 1) {
    if (latestTasks[i].status === true) {
      completeTasks.push(latestTasks[i]);
    } else {
      incompleteTasks.push(latestTasks[i]);
    }
  }
  return {
    completeTasks,
    incompleteTasks,
  };
}

export default function AppLanding({ cbSetUser }) {
  const [calendarDate, setCalendarDate] = useState(moment());
  const [isFocused, setFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [incompleteTasks, setIncompleteTasks] = useState();
  const [completeTasks, setCompleteTasks] = useState();

  init(setErrorMessage);

  async function getLatestTasksFromServerAndUpdateState(calendarDate) {
    try {
      const latestTasks = await getLatestTasksFromServer({
        momentjsObj: calendarDate,
      });
      console.log('horse', latestTasks);
      return seperateTasks({ latestTasks });
    } catch (error) {
      setIncompleteTasks(null);
      throw error;
    }
  }

  async function today() {
    const {
      completeTasks,
      incompleteTasks,
    } = await getLatestTasksFromServerAndUpdateState(moment());
    setCompleteTasks(completeTasks);
    setIncompleteTasks(incompleteTasks);
    setCalendarDate(moment());
  }

  async function nextDay() {
    const {
      completeTasks,
      incompleteTasks,
    } = await getLatestTasksFromServerAndUpdateState(
      calendarDate.clone().add(1, 'days'),
    );
    setCompleteTasks(completeTasks);
    setIncompleteTasks(incompleteTasks);
    setCalendarDate(calendarDate.clone().add(1, 'days'));
  }

  async function previousDay() {
    const {
      completeTasks,
      incompleteTasks,
    } = await getLatestTasksFromServerAndUpdateState(
      calendarDate.clone().subtract(1, 'days'),
    );
    setCompleteTasks(completeTasks);
    setIncompleteTasks(incompleteTasks);
    setCalendarDate(calendarDate.clone().subtract(1, 'days'));
  }

  useEffect(() => {
    async function getLatest() {
      const {
        completeTasks,
        incompleteTasks,
      } = await getLatestTasksFromServerAndUpdateState(calendarDate);
      setCompleteTasks(completeTasks);
      setIncompleteTasks(incompleteTasks);
    }
    getLatest();
  }, [calendarDate]);

  return (
    <>
      <Row>
        <Time />
      </Row>
      <Row className="border">
        <Col lg={4} className="bg-success justify-content-end order-lg-2 mb-2">
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
        <Col md={5} lg={4} className="bg-info mb-2">
          <ButtonToolbar
            aria-label="Toolbar with button groups"
          >
            <ButtonGroup className="flex-fill">
              <Button onClick={today}>Today</Button>
              <Button onClick={previousDay}>Previous</Button>
              <SingleDatePicker
                small
                date={calendarDate} // momentPropTypes.momentObj or null
                onDateChange={(calendarDate) => setCalendarDate(calendarDate)}
                  // PropTypes.func.isRequired
                focused={isFocused} // PropTypes.bool
                onFocusChange={({ focused }) => setFocused(focused)} // PropTypes.func.isRequired
                id="your_unique_id" // PropTypes.string.isRequired //why is this required and what should it be?
                isOutsideRange={() => false}
              />
              <Button onClick={nextDay}>Next</Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
        <Col md={7} lg={4} className="bg-danger mb-2">
          <NewTask
            momentjsObj={calendarDate}
            onCreateFinish={async () => {
              const {
                completeTasks,
                incompleteTasks,
              } = await getLatestTasksFromServerAndUpdateState(calendarDate);
              setCompleteTasks(completeTasks);
              setIncompleteTasks(incompleteTasks);
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
                completeTasks,
                incompleteTasks,
              } = await getLatestTasksFromServerAndUpdateState(calendarDate);
              setCompleteTasks(completeTasks);
              setIncompleteTasks(incompleteTasks);
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
