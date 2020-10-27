const config = require('config');
const jwt = require('jsonwebtoken');
const debug = require('debug')('app:auth');

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    if (!token) { throw Error('missing token'); }
    const secret = config.get('auth.secret');
    const payload = jwt.verify(token, secret);
    req.user = payload;
    debug(payload);
    next();
  } catch (err) {
    debug(err.message);
    res.redirect('/account/login');
  }
};
