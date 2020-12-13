import React, { Component } from "react";
import axios from "axios";
import { Card, Header, Form, Input, Icon, Button } from "semantic-ui-react";

let endpoint = "http://localhost:8000";

function RadioButton(props) {
  return <div class="field">
    <div class="ui radio checkbox">
      <input type="radio" name={props.name} checked={props.checked} tabindex="0" class="hidden"></input>
      <label>{props.name}</label>
    </div>
 </div>
}

class TaskList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: "",
      items: []
    };
  }

  componentDidMount() {
    this.getTask();
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = () => {
    let { task } = this.state;
    // console.log("pRINTING task", this.state.task);
    if (task) {
      axios
        .post(
          endpoint + "/api/task",
          {
            task
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(res => {
          this.getTask();
          this.setState({
            task: ""
          });
          console.log(res);
        });
    }
  };

  // addTask() {
  //   const text = prompt("TODO text please!")
  // }

  // addTodo() {
  //   const text = prompt("TODO text please!")
  //   this.setState({
  //     todos: [
  //       // clone an array (makes a new one with the same values but difference references)
  //       ...this.state.todos,
  //       {id: id++, text: text, checked: false},
  //     ], 
  //   })
  // }

  getTask = () => {
    axios.get(endpoint + "/api/task").then(res => {
      console.log(res);
      if (res.data) {
        this.setState({
          items: res.data.map(item => {
            let color = "yellow";

            if (item.status) {
              color = "green";
            }
            return (
              <Card key={item._id} color={color} fluid>
                <Card.Content>
                  <Card.Header textAlign="left">
                    <div style={{ wordWrap: "break-word" }}>{item.task}</div>
                  </Card.Header>

                  <Card.Meta textAlign="right">
                    <Icon
                      name="check circle"
                      color="green"
                      onClick={() => this.updateTask(item._id)}
                    />
                    <span style={{ paddingRight: 10 }}>Done</span>
                    <Icon
                      name="undo"
                      color="yellow"
                      onClick={() => this.undoTask(item._id)}
                    />
                    <span style={{ paddingRight: 10 }}>Undo</span>
                    <Icon
                      name="delete"
                      color="red"
                      onClick={() => this.deleteTask(item._id)}
                    />
                  </Card.Meta>
                </Card.Content>
              </Card>
            );
          })
        });
      } else {
        this.setState({
          items: []
        });
      }
    });
  };

  updateTask = id => {
    axios
      .put(endpoint + "/api/task/" + id, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => {
        console.log(res);
        this.getTask();
      });
  };

  undoTask = id => {
    axios
      .put(endpoint + "/api/undoTask/" + id, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => {
        console.log(res);
        this.getTask();
      });
  };

  deleteTask = id => {
    axios
      .delete(endpoint + "/api/deleteTask/" + id, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(res => {
        console.log(res);
        this.getTask();
      });
  };

  render() {
    return (
      <div>
        <br></br>

        <div id='new-task-group' class="ui segment">
          <form class="ui form">
            <div class="field">
              <input type="text" name="task-description" placeholder="Type to enter a task description"></input>
            </div>
            <div class="inline fields">
              <RadioButton name="Small" />
              <RadioButton name="Medium" />
              <RadioButton name="Large" />
            </div>
          </form>
        </div>

        <div className="row">
          <Card.Group>{this.state.items}</Card.Group>
        </div>
      </div>
    );
  }
}

export default TaskList;



{/* <div id='new-task-group' class="ui segment">
<form class="ui form">
  <div class="field">
    <input type="text" name="task-description" placeholder="Type to enter a task description"></input>
  </div>
  <div class="inline fields">
    <div class="field">
      <div class="ui radio checkbox">
        <input type="radio" name="Small" checked="small" tabindex="0" class="hidden"></input>
        <label>Small</label>
      </div>
    </div>
    <div class="field">
      <div class="ui radio checkbox">
        <input type="radio" name="Small" checked="small" tabindex="0" class="hidden"></input>
        <label>medium</label>
      </div>    
    </div>  
  </div>
</form>
</div> */}