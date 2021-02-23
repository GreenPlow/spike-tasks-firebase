import React, { useState } from "react";
import PropTypes from "prop-types";

import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { Button, ButtonToolbar } from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import DropdownItem from "react-bootstrap/DropdownItem";

import Container from "react-bootstrap/Container";

import { SingleDatePicker } from "react-dates";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

import TaskList from "./views/day/TaskList";
import Time from "./Time";
import SwitchUser from "./SwitchUser";

import moment from "moment";

export default function AppLanding({ user, cbSetUser }) {
  const [calendarDate, setCalendarDate] = useState(moment());
  const [isFocused, setFocused] = useState(false);

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
            </ButtonGroup>
            <ButtonGroup>
              <Button onClick={previousDay}>Previous Day</Button>
              <SingleDatePicker
                small
                date={calendarDate} // momentPropTypes.momentObj or null
                onDateChange={(calendarDate) => setCalendarDate(calendarDate)} // PropTypes.func.isRequired
                focused={isFocused} // PropTypes.bool
                onFocusChange={({ focused }) => setFocused(focused)} // PropTypes.func.isRequired
                id="your_unique_id" // PropTypes.string.isRequired //why is this required and what should it be?
                isOutsideRange={() => false}
              />
              <Button onClick={nextDay}>Next Day</Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
        <Col md="auto">
          <Nav variant="pills" defaultActiveKey="link-1">
            <Nav.Item>
              <Nav.Link eventKey="link-1">Day</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-2">Week</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-3">Overdue</Nav.Link>
            </Nav.Item>
          </Nav>
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
