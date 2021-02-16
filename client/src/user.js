let user = localStorage.getItem("user") || null;

function set(userName) {
  user = userName;
  localStorage.setItem("user", user);
}

function get() {
  if (!user) {
    throw new Error("User not logged in!");
  }
  return user;
}

export { set, get };
