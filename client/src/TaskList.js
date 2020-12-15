import React, { Component } from "react";
import axios from "axios";
import { Card, Header, Form, Input, Icon, Button } from "semantic-ui-react";

let endpoint = "http://localhost:8000";

function RadioButton(props) {
    return ( <div class="field" >
    <div class="ui radio checkbox">
      <input type="radio" name={props.name} checked={props.checked} tabindex="0" class="hidden"></input>
      <label>{props.name}</label>
    </div>
 </div> )
  }

  function TaskSizeSelector () {
    return (
      <div class="inline fields" >
        {["small", "medium", "large"].map(button => <RadioButton name={button} />)}
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
            onChange={(e) => this.setState({ textValue: e.target.value })}>
          </input>
        </div>
        <TaskSizeSelector />
      </form>
    </div>
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
setTextValue(input) {
  this.setState({ textValue: input.target.value })
  console.log(this.state.textValue)
}

  render() {

    return (
      <div>
        <br></br>
        <div id='new-task-group' class="ui segment">
          <form class="ui form">
            <div class="field">
              <input
                type="text"
                name="task-description"
                placeholder="Type to enter a task description"
                onInput={(char) => this.setTextValue(char)}>
                
              </input>
            </div>
            <TaskSizeSelector />
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