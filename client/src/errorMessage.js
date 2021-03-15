let globalHandler;

function init(handler) {
  globalHandler = handler;
}

function setAlert(message) {
  globalHandler(message);
}

export { init, setAlert };
