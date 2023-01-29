const { removeSession } = require("../model/session.js");

function post(req, res) {
  /**
   * [1] Get the session ID from the cookie
   * [2] Remove that session from the DB
   * [3] Remove the session cookie
   * [4] Redirect back home
   */
  // get session id from signed cookie
  const sid = req.signedCookies.sid;
  // use removeSession func to del session from db
  removeSession(sid);
  // clear sid cookie
  res.clearCookie("sid");
  // redirect to homepage
  res.redirect("/");
}

module.exports = { post };
