let user = localStorage.getItem('user') || undefined;

function setLocal(userName) {
  user = userName;
  if (!userName) {
    localStorage.removeItem('user');
  } else {
    localStorage.setItem('user', user);
  }
}

function get() {
  if (!user) {
    throw new Error('User not logged in!');
  }
  return user;
}

export { setLocal, get };
