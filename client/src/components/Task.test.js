// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import App from './App';

// it('renders welcome message', () => {
//   render(<App />);
//   expect(screen.getByText('Learn React')).toBeInTheDocument();
// });

import React from 'react';
import ReactDOM from 'react-dom'

import {render, cleanup, screen, fireEvent} from '@testing-library/react'
import { Card, Icon } from "semantic-ui-react";

import Task from "./Task";

import {
  deleteTask,
  completeTask,
  undoTask
} from "../taskActions"

jest.mock('../taskActions');

afterEach(cleanup);

const itemId = 123;
const item = {
  _id: itemId,
  task: 'test-task-value'
};

describe('my tests', () => {

  it("renders with or without a name", () => {

    // Arrange
  
    render(<Task item={item}/>);
    // returns a container, a base element, debug
    // container.firstChild.firstChildren


    // Act

    // Assert
    expect(screen.getByTestId('hh')).toHaveTextContent('test-task-value')

    // expect(screen.getByText('Learn React')).toBeInTheDocument();


    // expect(getByText(/Initial/i).textContent).toBe("Initial State")
    // fireEvent.click(getByText("State Change Button"))
    // expect(getByText(/Initial/i).textContent).toBe("Initial State Changed")
    
  });

  it ("should render the done button", async () => {
    // Arrange
    let completeTaskResolve;
    completeTask.mockReturnValue(new Promise((resolve, reject) => {
      completeTaskResolve = resolve;
    }));

    const onModificationMock = jest.fn();
    render(<Task item={item} onModification={onModificationMock}/>)

    // Act
    const button = screen.getByTestId('icon-green');
    expect(button).toBeInTheDocument()

    fireEvent.click(button)

    // Assert
    expect(completeTask).toHaveBeenCalledTimes(1);
    expect(completeTask).toHaveBeenCalledWith(itemId);

    expect(onModificationMock).toHaveBeenCalledTimes(0);

    await new Promise((resolve, reject) => {
      completeTaskResolve();
      resolve();
    });

    expect(onModificationMock).toHaveBeenCalledTimes(1);
  })
})


/* The way our end user will use this app will be to: see some text on the UI, 
see the text in the button, then click on it, finally see some new text on UI.
*/


    /*  ReactDOM.render()
        Takes the element, a container, and a callback
    */
// act(() => { render(element, container); });
// // https://reactjs.org/docs/test-utils.html
// const stuff = findRenderedComponentWithType(container, Card)
// console.log(stuff)