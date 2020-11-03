const express = require('express');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const db = require('../db');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
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
      //if (!user || user.password_hash != password) {
      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
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
        is_admin: user.is_admin,
        is_moderator: user.is_moderator,
      };
      const secret = config.get('auth.secret');
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });
      res.cookie('auth_token', token, { maxAge: 60 * 60 * 1000 });
      // const expires = config.get('auth.expires');
      // const token = jwt.sign(payload, secret, { expiresIn: expires + 'ms' });
      // res.cookie('auth_token', token, { maxAge: expires });
      res.redirect('/account/me');
      await db.updateLastLogin(user.id);
    }
  } catch (err) {
    next(err);
  }
});
router.get('/me', auth, (req, res) => {
  const auth = req.auth;
  res.render('account/profile', { title: 'Profile', user: auth });
});
router.get('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.redirect('/account/login');
});
router.get('/admin', auth, admin,  async (req, res, next) => {
  try {
    const users = await db.getAllUsers();
    res.render('account/admin', { title: 'Profile', users });
  } catch (err) {
    next(err);
  }
});
router.get('/:id', auth, admin,  async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await db.getUserById(id);
    if (user) {
      res.render('account/profile', { title: 'Profile', user });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

// export router
module.exports = router;
