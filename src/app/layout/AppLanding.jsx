import React, { useState } from "react";
import PropTypes from "prop-types";

import DropdownItem from "react-bootstrap/DropdownItem";
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Col,
  DropdownButton,
  Row,
} from "react-bootstrap";

import { SingleDatePicker } from "react-dates";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

import moment from "moment";

import AlertDismissible from "components/common/AlertDismissible";
import TaskList from "components/tasks/TaskList";
import NewTask from "components/tasks/NewTask";
import Time from "components/common/Time";
import SwitchUser from "components/common/SwitchUser";

import { init } from "app/api/errorMessage";
import { firebase } from "app/config/fire";

export default function AppLanding({ user, cbSetUser }) {
  const [calendarDate, setCalendarDate] = useState(moment());
  const [isFocused, setFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  init(setErrorMessage);

  function today() {
    setCalendarDate(moment());
  }

  function nextDay() {
    setCalendarDate(calendarDate.clone().add(1, "days"));
  }

  function previousDay() {
    setCalendarDate(calendarDate.clone().subtract(1, "days"));
  }

  return (
    <>
      <Row>
        <Time />
      </Row>
      <Row>
        <Col md="auto">
          <ButtonToolbar aria-label="Toolbar with button groups">
            <ButtonGroup>
              <Button onClick={today}>Today</Button>
              <Button onClick={previousDay}>Previous</Button>
              <SingleDatePicker
                small
                date={calendarDate} // momentPropTypes.momentObj or null
                onDateChange={(calendarDate) => setCalendarDate(calendarDate)} // PropTypes.func.isRequired
                focused={isFocused} // PropTypes.bool
                onFocusChange={({ focused }) => setFocused(focused)} // PropTypes.func.isRequired
                id="your_unique_id" // PropTypes.string.isRequired //why is this required and what should it be?
                isOutsideRange={() => false}
              />
              <Button onClick={nextDay}>Next</Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
        <Col>
          <DropdownButton
            title={`Hi ${firebase.auth().currentUser.displayName}!`}
            id="bg-nested-dropdown"
            className="d-flex justify-content-end"
          >
            <DropdownItem
              onClick={() => {
                // TODO is there any necessary error handling?
                firebase.auth().signOut();
                cbSetUser(undefined);
              }}
            >
              Logout
            </DropdownItem>
          </DropdownButton>
        </Col>
      </Row>
      <Row>
        <Col>
          <AlertDismissible msgObj={errorMessage} />
        </Col>
      </Row>
      <Row>
        <Col>
          <NewTask
            momentjsObj={calendarDate}
            onCreateFinish={() => {
              today(); // this needs to be replaced by lifting up the task state
              // pass in the function callback as a named prop
              // getLatestTasksFromServerAndUpdateState(calendarDate);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <h1>{calendarDate.format("dddd, MMM Do")}</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <TaskList calendarDate={calendarDate} triggerRender={user} />
        </Col>
      </Row>
      <Row>
        <Col>
          <SwitchUser cbSetUser={cbSetUser} />
        </Col>
      </Row>
    </>
  );
}

AppLanding.propTypes = {
  user: PropTypes.string.isRequired,
  cbSetUser: PropTypes.func.isRequired,
};
