import React, { useState } from "react";

import Container from "react-bootstrap/Container";

import AppLanding from "./components/AppLanding";
import AppLogin from "./components/AppLogin";

import "./App.css";

import { get, setLocal } from "./user";

function App() {
  const [user, setUser] = useState(undefined);

  if (!user) {
    try {
      setUser(get());
    } catch (e) {
      console.log(e);
    }
  }

  function handleUserLogin(value) {
    setUser(value);
    setLocal(value);
  }

  return (
    <Container fluid>
      {user ? (
        <AppLanding user={user} cbSetUser={handleUserLogin} />
      ) : (
        <AppLogin user={user} onSubmit={handleUserLogin} />
      )}
    </Container>
  );
}

export default App;
