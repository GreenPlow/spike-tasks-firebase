import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Task from "./Task";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('my tests', () => {

  it("renders with or without a name", () => {

    /*  ReactDOM.render()
        Takes the element, a container, and a callback
    */
    act(() => { render(<Task />, container); });
    expect(container.textContent).toBe("Hey, stranger");

    act(() => {
      render(<Hello name="Jenny" />, container);
    });
    expect(container.textContent).toBe("Hello, Jenny!");
  });
})


/* The way our end user will use this app will be to: see some text on the UI, 
see the text in the button, then click on it, finally see some new text on UI.
*/
