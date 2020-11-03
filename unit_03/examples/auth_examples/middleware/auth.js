const config = require('config');
const jwt = require('jsonwebtoken');
const debug = require('debug')('app:auth');

module.exports = (req, res, next) => {
  try {
    let token = req.cookies.auth_token;
    if (!token) {
      const authHeader = req.get('Authorization').split(' ');
      if (authHeader.length == 2 && authHeader[0] == 'Bearer') {
        token = authHeader[1];
      }
    }
    if (!token) { throw Error('missing token'); }
    const secret = config.get('auth.secret');
    if (!secret) { throw Error('secret not configured'); }
    const payload = jwt.verify(token, secret);
    debug(payload);
    req.auth = payload;
    next();
  } catch (err) {
    debug(err.message);
    if (req.xhr) {
      res.status(401).json({ error: err.message });
    } else {
      res.redirect('/account/login');
    }
  }
};
