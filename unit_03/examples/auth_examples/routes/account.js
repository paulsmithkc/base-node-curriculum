const express = require('express');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const authMiddleware = require('../middleware/auth');
const debug = require('debug')('app:routes:account');

// create and configure router
const router = express.Router();
router.use(express.urlencoded({ extended: false }));

// implement routes

router.get('/login', (req, res) =>
  res.render('account/login', { title: 'Login' })
);
router.post('/login', async (req, res, next) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    debug(`login "${username}" "${password}"`);

    let user = null;
    let error = null;
    if (!username) {
      error = 'username is required.';
    } else if (!password) {
      error = 'password is required.';
    } else {
      user = await db.getUserByName(username);
      if (!user) {
        user = await db.getUserByEmail(username);
      }
      if (!user || user.password_hash != password) {
      //if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        error = 'credentials invalid.';
      } else {
        error = null;
      }
    }

    if (error) {
      res.render('account/login', {
        title: 'Login',
        username: username,
        error: error,
      });
    } else {
      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
      };
      const secret = config.get('auth.secret');
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });
      res.cookie('auth_token', token, { maxAge: 60 * 60 * 1000 });
      res.redirect('/account/me');
    }
  } catch (err) {
    next(err);
  }
});
router.get('/me', authMiddleware, (req, res) =>
  res.render('account/profile', { title: 'Profile', user: req.user })
);
router.get('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.redirect('/account/login')
});

// export router
module.exports = router;
