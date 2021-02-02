import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css'
import React, { useState } from 'react';
import { Container, Header } from "semantic-ui-react";
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';

import TaskList from "./components/TaskList";
import Time from "./components/Time";
import "./App.css";

function App() {
  const [date, setDate] = useState(moment());
  const [isFocused, setFocused] = useState(false);
  
  return (
    <div>
      <Container>
        <Header className="header" as="h2" textAlign="center">
          <Time />
          {/* TODO REVIEW THIS LIB FOR A BETTER ONE */}
          <SingleDatePicker
            date={date} // momentPropTypes.momentObj or null 
            onDateChange={date => setDate(date)} // PropTypes.func.isRequired
            focused={isFocused} // PropTypes.bool
            onFocusChange={({ focused }) => setFocused(focused)} // PropTypes.func.isRequired
            id="your_unique_id" // PropTypes.string.isRequired //why is this required and what should it be?
          />
        </Header>
        <TaskList />
      </Container>
    </div>
  );
}
export default App;
