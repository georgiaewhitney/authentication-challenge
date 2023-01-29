const { Layout } = require("../templates.js");
const { getSession } = require("../model/session.js");

function get(req, res) {
  /**
   * [1] Read session ID from cookie
   * [2] Get session from DB
   * [3] If the session exists render a log out form
   * [4] This should submit a request to `POST /log-out`
   * [5] Else render the sign up/log in links
   */
  const title = "Confess your secrets!";
  // read session id from signed cookie
  const sid = req.signedCookies.sid;
  //get session from db
  const session = getSession(sid);
  // render out a log out form submitting req to POST/log-out
  // else render sign up / log in links
  const content = /*html*/ `
    <div class="Cover">
      <h1>${title}</h1>
      ${
        session
          ? /*html*/ `<form method="POST" action="/log-out"><button>Log out</button></form>`
          : /*html*/ `<nav><a href="/sign-up">Sign up</a> or <a href="/log-in">log in</a></nav>`
      }
    </div>
  `;
  const body = Layout({ title, content });
  res.send(body);
}

module.exports = { get };
