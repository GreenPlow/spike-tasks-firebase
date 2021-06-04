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
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        console.log(user);
        setUser(user.uid);
        setLocal(user.uid);
      } else {
        // User is signed out
        console.log('logmeinplease');
        setUser(null);
      }
    });
  }, []);

  return (
    <Container fluid>
      {user ? (
        <AppLanding user={user} cbSetUser={setUser} />
      ) : (
        <AppLogin user={user} />
      )}
    </Container>
  );
}

export default App;
