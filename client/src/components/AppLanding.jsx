import React, { useState } from "react";
import PropTypes from "prop-types";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Header } from "semantic-ui-react";
import { SingleDatePicker } from "react-dates";

import TaskList from "./TaskList";
import Time from "./Time";

import moment from "moment";

export default function AppLanding({ user, onSubmit }) {
  const [calendarDate, setCalendarDate] = useState(moment());
  const [isFocused, setFocused] = useState(false);

  function today() {
    setCalendarDate(moment());
  }

  function nextDay() {
    setCalendarDate(calendarDate.clone().add(1, "days"));
  }

  return (
    <Container>
      <div style={{ textAlign: "right" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(e.target[0].value);
          }}
        >
          <div style={{ textAlign: "right" }}>{user} is logged in!</div>
          <label hmtlFor="switchUser">Switch User</label>
          <input defaultValue={user} id="switchUser"></input>
        </form>
        <form>
          <Button
            onClick={() => {
              onSubmit(undefined);
            }}
          >
            Logout
          </Button>
        </form>
      </div>
      <Button onClick={today}>Today</Button>
      <Button onClick={nextDay}>Next Day</Button>
      <Header className="header" as="h2" textAlign="center">
        <Time />
        {/* TODO REVIEW THIS LIB FOR A BETTER ONE */}
        <SingleDatePicker
          date={calendarDate} // momentPropTypes.momentObj or null
          onDateChange={(calendarDate) => setCalendarDate(calendarDate)} // PropTypes.func.isRequired
          focused={isFocused} // PropTypes.bool
          onFocusChange={({ focused }) => setFocused(focused)} // PropTypes.func.isRequired
          id="your_unique_id" // PropTypes.string.isRequired //why is this required and what should it be?
        />
      </Header>
      <TaskList calendarDate={calendarDate} triggerRender={user} />
    </Container>
  );
}

AppLanding.propTypes = {
  user: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
