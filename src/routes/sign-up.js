const { Layout } = require("../templates.js");
// use bcrypt library to hash password
const bcrypt = require("bcryptjs");
const { createUser } = require("../model/user.js");
const { createSession } = require("../model/session.js");

function get(req, res) {
  const title = "Create an account";
  const content = /*html*/ `
    <div class="Cover">
      <h1>${title}</h1>
      <form method="POST" class="Row">
        <div class="Stack" style="--gap: 0.25rem">
          <label for="email">email</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="Stack" style="--gap: 0.25rem">
          <label for="password">password</label>
          <input type="password" id="password" name="password" required>
        </div>
        <button class="Button">Sign up</button>
      </form>
    </div>
  `;
  const body = Layout({ title, content });
  res.send(body);
}

function post(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Bad input");
  } else {
    // hash the password via bcrypt library
    bcrypt.hash(password, 12).then((hash) => {
      // use createUser func to insert new user in db
      const user = createUser(email, hash);
      // use createSession func to insert new session in db
      const session_id = createSession(user.id);
      // set signed sid cookie
      res.cookie("sid", session_id, {
        signed: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        sameSite: "lax",
      });
      // redirect to the new user's confession page
      res.redirect(`/confessions/${user.id}`);
    });
    /**
     * [1] Hash the password
     * [2] Create the user in the DB
     * [3] Create the session with the new user's ID
     * [4] Set a cookie with the session ID
     * [5] Redirect to the user's confession page (e.g. /confessions/3)
     */
  }
}

module.exports = { get, post };
