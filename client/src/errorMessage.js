let handler;

function init(h) {
  handler = h;
}

function set(message) {
  handler(message);
}

export { init, set };
