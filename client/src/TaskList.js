import React, { Component } from "react";
import axios from "axios";
import { Card, Header, Form, Input, Icon, Button } from "semantic-ui-react";

let endpoint = "http://localhost:8000";

function RadioButton(props) {
    return ( <div class="field">
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

  function NewTaskForm () {
    return (
      <div id='new-task-group' class="ui segment">
      <form class="ui form">
        <div class="field">
          <input type="text" name="task-description" placeholder="Type to enter a task description"></input>
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
      items: []
    };
  }

  render() {

    return (
      <div>
        <br></br>
        < NewTaskForm />
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