import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';

export default function SwitchUser({ cbSetUser }) {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity()) {
      setValidated(false);
      cbSetUser(event.target[0].value);
      event.target[0].value = ''; // eslint-disable-line no-param-reassign
      // eslint thinks event is a parameter from static analysis
    } else {
      event.stopPropagation();
      setValidated(true);
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Switch User</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter a username"
          required // browser will evaluate if the field has text
        />
        <Form.Control.Feedback type="invalid">
          Please provide a username.
        </Form.Control.Feedback>
      </Form.Group>
    </Form>
  );
}

SwitchUser.propTypes = {
  cbSetUser: PropTypes.func.isRequired,
};
