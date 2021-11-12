import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { firebase } from 'app/config/fire';

export default function LoginScreen() {
  return (
    <Row>
      <Col>
        <div className="p-5 mb-4 bg-light rounded-3">
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold">Hello!</h1>
            <p className="col-md-8 fs-4">You are not logged in.</p>
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
          </div>
        </div>
      </Col>
    </Row>
  );
}

// className="justify-content-center class="align-self-center""
// style={{
//   textAlign: 'center',
//   padding: '180px',
// }}
