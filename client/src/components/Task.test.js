
import React from 'react';
import Chance from 'chance';
const chance = new Chance();

import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import Task from "./Task";
import {
  completeTask
} from "../taskActions"

jest.mock('../taskActions');

afterEach(cleanup);

describe('tests for task compontent', () => {

  const itemId = chance.string({ pool: '1234567890' });
  const item = {
    _id: itemId,
    task: chance.string()
  };

  it("renders a task with provided text from props", () => {

    // Arrange
    render(<Task item={item} />);
    // returns a container, a base element, debug
    // container.firstChild.firstChild

    // Act

    // Assert
    expect(screen.getByTestId('hh')).toHaveTextContent(item.task)
  });

  it("should render the done button", async () => {
    // Arrange
    let completeTaskResolve;
    completeTask.mockReturnValue(new Promise((resolve, reject) => {
      completeTaskResolve = resolve;
    }));

    const onModificationMock = jest.fn();
    render(<Task item={item} onModification={onModificationMock} />)

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


/* USER ACTION EXAMPLE
The way our end user will use this app will be to: see some text on the UI,
see the text in the button, then click on it, finally see some new text on UI.
*/

/*  ReactDOM.render()
    Takes the element, a container, and a callback
*/

// act(() => { render(element, container); });
// // https://reactjs.org/docs/test-utils.html
// const stuff = findRenderedComponentWithType(container, Card)
// console.log(stuff)