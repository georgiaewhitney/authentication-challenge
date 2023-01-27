const db = require("../database/db.js");
const crypto = require("node:crypto");

const insert_session = db.prepare(
  /*sql*/
  `
INSERT INTO sessions (id, user_id, expires_at) VALUES (
  $id, 
  $user_id,
  -- ensure expires_at column is set to future date
  DATE('now', '+10 days')
)
`
);

// take user_id as an argument
function createSession(user_id) {
  // generate a random string to use as session id
  const id = crypto.randomBytes(18).toString("base64");
  // insert new session into the db
  insert_session.run({ id, user_id });
  // return generated id to store in cookie later on
  return id;
}

const select_session = db.prepare(`
  SELECT id, user_id, expires_at
  FROM sessions WHERE id = ?
`);

function getSession(sid) {
  return select_session.get(sid);
}

const delete_session = db.prepare(`
  DELETE FROM sessions WHERE id = ?
`);

function removeSession(sid) {
  return delete_session.run(sid);
}

module.exports = { createSession, getSession, removeSession };
