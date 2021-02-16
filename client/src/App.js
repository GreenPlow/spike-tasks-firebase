import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import React, { useState } from "react";
import { Container, Header } from "semantic-ui-react";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";

import TaskList from "./components/TaskList";
import Time from "./components/Time";
import "./App.css";

import Button from "react-bootstrap/Button";
import { get, set } from "./user";

import { getLatestTasksFromServer } from "./api/taskActions";

function App() {
  const [calendarDate, setCalendarDate] = useState(moment());
  const [isFocused, setFocused] = useState(false);
  const [user, setUser] = useState("");
  console.log("user state", user);

  function today() {
    setCalendarDate(moment());
  }

  function nextDay() {
    setCalendarDate(calendarDate.clone().add(1, "days"));
  }

  function ShowLogin() {
    return (
      <Container>
        <div
          style={{
            textAlign: "center",
            padding: "200px",
          }}
        >
          <div>you done logged out.. type a username to log in</div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setUser(e.target[0].value);
              set(e.target[0].value);
            }}
          >
            <input defaultValue={user}></input>
          </form>
        </div>
      </Container>
    );
  }

  function ShowTheApp() {
    return (
      <Container>
        <div style={{ textAlign: "right" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setUser(e.target[0].value);
              set(e.target[0].value);
            }}
          >
            <div style={{ textAlign: "right" }}>{user} is logged in!</div>
            <label hmtlFor="switchUser">Switch User</label>
            <input defaultValue={user} id="switchUser"></input>
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
        <TaskList calendarDate={calendarDate} />
      </Container>
    );
  }

  return <div>{user ? <ShowTheApp /> : <ShowLogin />}</div>;
}
export default App;
