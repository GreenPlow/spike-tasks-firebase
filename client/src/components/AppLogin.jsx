import React from "react";
import PropTypes from "prop-types";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

export default function LoginScreen({ user, onSubmit }) {
  return (
    <Container fluid>
      <div
        style={{
          textAlign: "center",
          padding: "180px",
        }}
      >
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(e.target[0].value);
          }}
        >
          <Form.Group>
            <Form.Label>
              you done logged out.. type a username to log in
            </Form.Label>
            <Form.Control defaultValue={user} />
          </Form.Group>
        </Form>
      </div>
    </Container>
  );
}

LoginScreen.propTypes = {
  user: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
