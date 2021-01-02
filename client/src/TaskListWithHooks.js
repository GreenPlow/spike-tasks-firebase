/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Card, Header, Form, Input, Icon } from "semantic-ui-react";

let endpoint = "http://localhost:8000";

export default function TaskList () {
  const [newTask, setNewTask] = useState('');
  const tasks = useTaskList();


  function handleNewTask(e) {
    setNewTask(e.target.value);
    console.log('here')
  }

  function Row(props) {
    let color = "yellow";
  
    if (props.status) {
      color = "green";
    }
  
    return (
      <Card key={props._id} color={color} fluid>
        <Card.Content>
          <Card.Header textAlign="left">
            <div style={{ wordWrap: "break-word" }}>{props.task}</div>
          </Card.Header>
          <Card.Meta textAlign="right">
            <Icon
              name="check circle"
              color="green"
            />
            <span style={{ paddingRight: 10 }}>Done</span>
            <Icon
              name="undo"
              color="yellow"
            />
            <span style={{ paddingRight: 10 }}>Undo</span>
            <Icon
              name="delete"
              color="red"
            />
            <span style={{ paddingRight: 10 }}>Delete</span>
          </Card.Meta>
        </Card.Content>
      </Card>
    );
  }

  return (
    <div>
      <div>
        <Header className="header" as="h2">
          TASK LIST
        </Header>
      </div>
      <div className="row">
        <Form>
          <Input
            type="text"
            name="task"
            fluid
            placeholder="Create Task"
            value={newTask}
            onChange={handleNewTask}
          />
        </Form>
      </div>
      <div className="row">
        <Card.Group>{tasks.map(item => <Row key={item._id} task={item.task} />)}</Card.Group>
      </div>
    </div>
  );

  function useTaskList () {
    const [tasks, setTasks] = useState([])
    useEffect( async () => {
      const res = await axios.get(endpoint + "/api/task")
      console.log(res)
      if (res.data) {
        setTasks(res.data)
      }
    }, [newTask])
    return tasks
  }
}
