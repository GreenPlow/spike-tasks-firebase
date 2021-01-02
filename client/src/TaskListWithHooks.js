/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Card, Header, Form, Input, Icon } from "semantic-ui-react";

let endpoint = "http://localhost:8000";

const testItems = [
  {
    "_id": "5fbf265dbaf57a1bd9efbed1",
    "status": true,
    "task": "neat"
  },
  {
    "_id": "5fbf2667baf57a1bd9efbed2",
    "status": false,
    "task": "other thing"
  },
  {
    "_id": "5febf5a8530b93c97a3b6f25",
    "status": false,
    "task": "does this still work"
  }
]

// function getAllTasks() {
//   axios.get(endpoint + "/api/task").then(res => {
//     console.log(res);
//     if (res.data) {
//         return res.data.map(item => {
//           console.log('call component')
//       })
//     }
//     else {
//       return []
//     }
//   })
// }

// getAllTasks = () => {
//   axios.get(endpoint + "/api/task").then(res => {
//     console.log(res);
//     if (res.data) {
//       this.setState({
//         items: res.data.map(item => {
//           console.log('call component')
//         })
//       })
//     }
//     else {
//     this.setState({
//       items: []
//     });
// }


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

function MainApp() {
  // const [tasks, setItems] = useState(testItems);
  const [newTask, setTask] = useState('');
  const [tasks, setTasks] = useState([])

  // useEffect( () => {
  //   axios.get(endpoint + "/api/task")
  //   .then(res => { 
  //     console.log(res)
  //     if (res.data) {
  //       setTasks(res.data)
  //     }
  //   })
  // }, [tasks])

  useEffect( async () => {
    const res = await axios.get(endpoint + "/api/task")
    console.log(res)
    if (res.data) {
      setTasks(res.data)
    }
  }, [newTask])

  function handleNewTask(e) {
    setTask(e.target.value);
    console.log('here')
  }

  // useEffect(() => {
  //   axios.get(endpoint + "/api/task").then(res => {
  //     console.log(res)
  //     if (res.data) {
  //       setItems()
  //     }
  //   })
  // })

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
        <Card.Group>{tasks.map(item => <Row task={item.task} />)}</Card.Group>
      </div>
    </div>
  );
  
}

export default MainApp;


