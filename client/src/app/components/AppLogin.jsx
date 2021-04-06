import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { firebase } from "../config/fire";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

export default function LoginScreen({ user }) {
  // useEffect(() => {
  //   if (user === null) {
  //     var provider = new firebase.auth.GoogleAuthProvider();
  //     firebase.auth().signInWithPopup(provider);
  //   }
  // }, [user]);

  return (
    <Container fluid>
      <div
        style={{
          textAlign: "center",
          padding: "180px",
        }}
      >
        <Form
        >
          <Form.Group>
            <Form.Label>
              You are no logged in, please choose an option below.
            </Form.Label>
            <button
              onClick={function (e) {
                e.preventDefault();
                var provider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithPopup(provider);
              }}
            >Login with Google</button>
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
