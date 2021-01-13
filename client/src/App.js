import React from "react";
import "./App.css";

// import the Container Component from the semantic-ui-react
import { Container } from "semantic-ui-react";

// import the TaskList component
import TaskList from "./TaskListWithHooks";

function App() {
  return (
    <div>
      <Container>
        <TaskList/>
      </Container>
    </div>
  );
}
export default App;
