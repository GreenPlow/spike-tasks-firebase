import React, { useState } from "react";
import PropTypes from "prop-types";

import Form from "react-bootstrap/Form";

export default function SwitchUser({ cbSetUser }) {
  const [validated, setValidated] = useState(false);
  const [value, setValue] = useState("");

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      setValidated(false);
      cbSetUser(value);
      setValue("");
    }
  };

  // onSubmit={(e) => {
  //     e.preventDefault();
  //     onSubmit(e.target[0].value);
  //   }}

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Switch User</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter a username"
          required
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
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
