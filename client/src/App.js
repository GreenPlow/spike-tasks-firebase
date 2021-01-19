/* eslint-disable */
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css'
import React, { useState } from 'react';
import "./App.css";

// import the Container Component from the semantic-ui-react
import { Container, Header, Form } from "semantic-ui-react";
import { SingleDatePicker} from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

import TaskList from "./components/TaskListWithHooks";
import Time from "./components/Time";
import moment from 'moment';

function App() {
  const [date, setDate] = useState(moment());

  const [isFocused, setFocused] = useState(false);
  return (
    <div>
      <Container>
        <Header className="header" as="h2" textAlign="center">
          <Time />
          <SingleDatePicker
            date={date} // momentPropTypes.momentObj or null
            onDateChange={date => setDate(date)} // PropTypes.func.isRequired
            focused={isFocused} // PropTypes.bool
            onFocusChange={({ focused }) => setFocused(focused)} // PropTypes.func.isRequired
            id="your_unique_id" // PropTypes.string.isRequired,
          />
        </Header>
        <TaskList />
      </Container>
    </div>
  );
}
export default App;

function DatePicker() {
  return (
    <Form onSubmit>
        <input type="date" placeholder="yyyy-mm-dd" display="flex"></input>
    </Form>
  )
}