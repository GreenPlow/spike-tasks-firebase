import React from 'react';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

import { firebase } from 'app/config/fire';

export default function LoginScreen() {
  return (
    <Container fluid>
      <div
        style={{
          textAlign: 'center',
          padding: '180px',
        }}
      >
        <Form>
          <Form.Group>
            <Form.Label>You are not logged in.</Form.Label>
            <button
              onClick={(e) => {
                e.preventDefault();
                const provider = new firebase.auth.GoogleAuthProvider();
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
