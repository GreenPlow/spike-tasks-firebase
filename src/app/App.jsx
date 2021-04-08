import React, { useState, useEffect } from "react";
import axios from "axios";
import { setAlert } from "./errorMessage";
import handleAxiosError from "../app/api/errorHandler";

import Container from "react-bootstrap/Container";

import AppLanding from "./components/AppLanding";
import AppLogin from "./components/AppLogin";

import "./App.css";

import { get, setLocal } from "../user";
import { firebase } from "../app/config/fire";

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
        console.log("logmeinbro");
        setUser(null);
      }
    });
  }, []);

  return (
    <Container fluid>
      {user ? (
        <AppLanding user={user} cbSetUser={setUser}/>
      ) : (
        <AppLogin user={user} />
      )}
    </Container>
  );
}

export default App;

axios.interceptors.request.use(function (config) {
  config.headers["X-USERNAME"] = get();
  return config;
});

// These should be able to be moved backed to the errorHandler.js
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    setAlert("");
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    handleAxiosError(error);
    return Promise.reject(error);
  }
);
