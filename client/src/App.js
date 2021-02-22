import React, { useState } from "react";

import AppLanding from "./components/AppLanding";
import AppLogin from "./components/AppLogin";

import "./App.css";

import { get, set } from "./user";

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
    set(value);
  }

  return (
    <div>
      {user ? (
        <AppLanding user={user} cbSetUser={handleUserLogin} />
      ) : (
        <AppLogin user={user} onSubmit={handleUserLogin} />
      )}
    </div>
  );
}

export default App;
