import React from "react";
import "./App.css";

// import the Container Component from the semantic-ui-react
import { Container, Header } from "semantic-ui-react";

import TaskList from "./TaskListWithHooks";
import Time from "./Time";

function App() {
  return (
    <div>
      <Container>
        <Header className="header" as="h2" textAlign="center">
          <Time />
        </Header>
        <TaskList/>
      </Container>
    </div>
  );
}
export default App;
