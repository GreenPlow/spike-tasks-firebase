import React, { useState } from "react";
import axios from "axios";
import { setAlert } from "./errorMessage";
import handleAxiosError from "./api/errorHandler";

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

axios.interceptors.request.use(function (config) {
  config.headers["X-USERNAME"] = get();
  return config;
});

axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log("monkey");
    setAlert("");
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log("ha");
    handleAxiosError(error);
    return Promise.reject(error);
  }
);
