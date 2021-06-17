import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';

import { firebase } from 'app/config/fire';

export default function LoginScreen() {
  return (
    <Row>
      <Col>
        <Jumbotron>
          <h1>Hello!</h1>
          <p>
            You are not logged in.
          </p>
          <p>
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                const provider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithPopup(provider);
              }}
            >
              Login with Google
            </Button>
          </p>
        </Jumbotron>
      </Col>
    </Row>
  );
}

// className="justify-content-center class="align-self-center""
// style={{
//   textAlign: 'center',
//   padding: '180px',
// }}
