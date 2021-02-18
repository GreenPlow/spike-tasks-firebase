import React from "react";
import PropTypes from "prop-types";

import Container from "react-bootstrap/Container";


export default function LoginScreen({ user, onSubmit}) {
  return (
    <Container>
      <div
        style={{
          textAlign: "center",
          padding: "200px",
        }}
      >
        <div>you done logged out.. type a username to log in</div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(e.target[0].value);
          }}
        >
          <input defaultValue={user}></input>
        </form>
      </div>
    </Container>
  );
}

LoginScreen.propTypes = {
  user: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
