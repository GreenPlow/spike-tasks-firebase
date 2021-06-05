import React from "react";
import PropTypes from "prop-types";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

import { firebase } from "app/config/fire";

export default function LoginScreen({ user }) {
  return (
    <Container fluid>
      <div
        style={{
          textAlign: "center",
          padding: "180px",
        }}
      >
        <Form>
          <Form.Group>
            <Form.Label>You are not logged in.</Form.Label>
            <button
              onClick={function (e) {
                e.preventDefault();
                var provider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithPopup(provider);
              }}
            >
              Login with Google
            </button>
          </Form.Group>
        </Form>
      </div>
    </Container>
  );
}

LoginScreen.propTypes = {
  user: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};
