import React, { Component } from "react";
import axios from "axios";
import { Card, Header, Form, Input, Icon, Button } from "semantic-ui-react";

let endpoint = "http://localhost:8000";

function RadioButton(props) {
    return (
      <div class="field" >
        <div class="ui radio checkbox">
          <input type="radio" name={props.name} checked={props.checked} tabindex="0" disabled={props.disabled} class="hidden"></input>
          <label>{props.name}</label>
        </div>
      </div> )
    }

  function TaskSizeSelector (props) {
    return (
      <div class="inline fields" >
        {["small", "medium", "large"].map(buttonText => <RadioButton name={buttonText} enabled={props.enabled}/>)}
      </div>
    )
  }

  function NewTaskForm (props) {
    return (
      <div id='new-task-group' class="ui segment">
        <form class="ui form">
          <div class="field">
            <input
              type="text"
              name="task-description"
              placeholder="Type to enter a task description"
              onChange={(event) => this.setState({ textValue: event.target.value })}>
            </input>
          </div>
          <TaskSizeSelector />
        </form>
      </div>
    )
  }

  function Time() {
    const time = new Date().toLocaleTimeString()
    return (
      <div>{time}</div>
    )
  }


class TaskList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task: "",
      items: [],
      textValue: ""
    };
  }

  someMethod() {
    console.log('test')
  }

  //   onChange(i){
  //     this.setState({
  //       textValue:index
  //     });
  //  }

  //  onChange = event => {
  //   this.setState({
  //     [event.target.name]: event.target.value
  //   });
  // };
  // setTextValue(input) {
  //   this.setState({ textValue: input.target.value })
  //   console.log(this.state.textValue)
  // }

  // render() {
  //   return(<span>first render</span>)
  // }

  render() {
    return (
      <div>
        <br></br>
        <Time />
        <div id='new-task-group' class="ui segment">
          <form class="ui form">
            <div class="field">
              <input
                type="text"
                name="task-description"
                placeholder="Type to enter a task description"
                onChange={(event) => {
                  const {value} = event.target;
                  console.log(value)
                  if (value.length > 0) {
                    this.setState({ textValue: value});
                  }
                }}>
              </input>
            </div>
          </form>
        </div>
        <div className="row">
          <Card.Group>{this.state.items}</Card.Group>
        </div>
      </div>
    )
  }
}
setInterval(Time, 1000)

export default TaskList;

{/* <html>
  <input
    type="text"
    name="task-description"
    placeholder="Type to enter a task description"
    onInput={(char) => this.setTextValue(char)}>
  </input>

  onChange={(event) => {
    const { value } = event.target;
    if (value.length > 0) {
      this.setState({ textValue: value });
    }
  }}

  <div id='new-task-group' class="ui segment">
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
  </div>
</html> */}

