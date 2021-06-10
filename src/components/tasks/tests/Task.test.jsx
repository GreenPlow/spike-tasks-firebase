import React from 'react';
import Chance from 'chance';

import { render, screen } from '@testing-library/react';
import Task from 'components/tasks/Task';

jest.mock('app/api/taskActions');

// afterEach(cleanup);
const chance = new Chance();

describe('tests for task component', () => {
  const itemId = chance.string({ pool: '1234567890' });
  const testTaskObj = {
    id: itemId,
    task: chance.string(),
    status: chance.bool(),
    size: chance.pickone(['small', 'medium', 'large']),
    startDateTime: { test: chance.date().toString() },
  };

  it('renders a task provided by props', () => {
    render(<Task taskObj={testTaskObj} onModification={jest.fn()} />);
    // render returns a container, a base element, debug
    // container.firstChild.firstChild

    const task = screen.getByText(testTaskObj.task);

    expect(task).toHaveTextContent(testTaskObj.task);
  });
});
