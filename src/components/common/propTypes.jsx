import PropTypes from 'prop-types';

export const taskObjPropTypes = PropTypes.exact({
  _id: PropTypes.string.isRequired,
  task: PropTypes.string.isRequired,
  status: PropTypes.bool.isRequired,
  size: PropTypes.string,
  startDateTime: PropTypes.object.isRequired,
  createdAt: PropTypes.object,
});
