import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';

import { setLocal } from 'app/user';
import { firebase } from 'app/config/fire';
import AppLanding from 'app/layout/views/AppLanding';
import AppLogin from 'app/layout/views/AppLogin';

import 'app/layout/App.css';

function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(firebaseUser.uid);
        setLocal(firebaseUser.uid);
      } else {
        // User is signed out
        setUser(null);
      }
    });
  }, []);

  return (
    <Container fluid>
      {user ? (
        <AppLanding cbSetUser={setUser} />
      ) : (
        <AppLogin />
      )}
    </Container>
  );
}

export default App;
