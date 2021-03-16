import React, { useState } from "react";
import PropTypes from "prop-types";

import DropdownItem from "react-bootstrap/DropdownItem";
import {
  Alert,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Col,
  Container,
  DropdownButton,
  Row,
} from "react-bootstrap";

import { SingleDatePicker } from "react-dates";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

import TaskList from "./views/day/TaskList";
import NewTask from "./views/day/NewTask";
import Time from "./Time";
import SwitchUser from "./SwitchUser";
import { init, setAlert } from "../errorMessage";

import moment from "moment";

function AlertDismissible({ msgObj }) {
  if (msgObj) {
    const { heading, message } = msgObj;

    return (
      <Alert
        variant="danger"
        className="my-2"
        onClose={() => setAlert("")}
        dismissible
      >
        <Alert.Heading>{heading}</Alert.Heading>
        <p>{message}</p>
      </Alert>
    );
  } else {
    return null;
  }
}

AlertDismissible.propTypes = {
  message: PropTypes.object,
};

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
    <div>
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
            title={`Hi ${user}!`}
            id="bg-nested-dropdown"
            className="d-flex justify-content-end"
          >
            <DropdownItem
              onClick={() => {
                cbSetUser(undefined);
              }}
            >
              Logout
            </DropdownItem>
          </DropdownButton>
        </Col>
      </Row>
      <AlertDismissible msgObj={errorMessage} />
      <NewTask
        dateObj={calendarDate}
        onCreateFinish={() => {
          today() // is this an okay way to re-render the sibling?
          // pass in the function callback as a named prop
          // getLatestTasksFromServerAndUpdateState(calendarDate);
        }}
      />
      <Row>
        <Col>
          <h1>{calendarDate.format("dddd, MMM Do")}</h1>
        </Col>
      </Row>
      <div>
        <TaskList calendarDate={calendarDate} triggerRender={user} />
      </div>
      <Container>
        <SwitchUser cbSetUser={cbSetUser} />
      </Container>
    </div>
  );
}

AppLanding.propTypes = {
  user: PropTypes.string.isRequired,
  cbSetUser: PropTypes.func.isRequired,
};
