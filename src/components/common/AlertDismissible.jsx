import React from 'react';
import PropTypes from 'prop-types';

import { setAlert } from 'app/api/errorMessage';

import { Alert } from 'react-bootstrap';

export default function AlertDismissible({ msgObj }) {
  if (msgObj) {
    const { heading, message } = msgObj;

    return (
      <Alert
        variant="danger"
        className="my-2"
        onClose={() => setAlert('')}
        dismissible
      >
        <Alert.Heading>{heading}</Alert.Heading>
        <p>{message}</p>
      </Alert>
    );
  }
  return null;
}

AlertDismissible.propTypes = {
  msgObj: PropTypes.shape({
    heading: PropTypes.string,
    message: PropTypes.element,
  }),
};

AlertDismissible.defaultProps = {
  msgObj: undefined,
};
