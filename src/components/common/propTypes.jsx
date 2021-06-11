import PropTypes from 'prop-types';

const taskObjPropTypes = PropTypes.exact({
  id: PropTypes.string.isRequired,
  task: PropTypes.string.isRequired,
  status: PropTypes.bool.isRequired,
  size: PropTypes.string,
  startDateTime: PropTypes.object.isRequired,
  createdAt: PropTypes.object,
});

export default taskObjPropTypes;
