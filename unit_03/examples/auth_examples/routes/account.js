const express = require('express');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const db = require('../db');
const sendgrid = require('../sendgrid');
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
        is_email_verified: user.is_email_verified,
        type: 'login',
      };
      const secret = config.get('auth.secret');
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });
      res.cookie('auth_token', token, { maxAge: 60 * 60 * 1000 });
      // const expires = config.get('auth.expires');
      // const token = jwt.sign(payload, secret, { expiresIn: expires + 'ms' });
      // res.cookie('auth_token', token, { maxAge: expires });
      res.redirect('/account/profile/me');
      await db.updateLastLogin(user.id);
    }
  } catch (err) {
    next(err);
  }
});
router.get('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.redirect('/account/login');
});
router.get('/admin', auth, admin, async (req, res, next) => {
  try {
    const users = await db.getAllUsers();
    res.render('account/admin', { title: 'Profile', users, auth: req.auth });
  } catch (err) {
    next(err);
  }
});
router.get('/verify_email/', auth, async (req, res, next) => {
  try {
    await sendgrid.sendVerifyEmail(req.auth);
    res.render('account/verify_email', {
      title: 'Verify Email',
      verified: false,
      auth: req.auth,
    });
  } catch (err) {
    next(err);
  }
});
router.get('/verify_email/:token', async (req, res, next) => {
  try {
    const token = req.params.token;
    const secret = config.get('sendgrid.secret');
    const payload = jwt.verify(token, secret);
    debug('verify email', payload);
    if (payload.type != 'verify_email') {
      throw new Error('invalid token type');
    }
    await db.updateEmailVerified(payload.id, true);
    res.render('account/verify_email', {
      title: 'Email Verified',
      verified: true,
      tokenPayload: payload,
      auth: req.auth,
    });
  } catch (err) {
    next(err);
  }
});
router.get('/reset_password/', (req, res) => {
  return res.render('account/reset_password', { title: 'Reset Password' });
});
router.post('/reset_password/', async (req, res, next) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).render('account/reset_password', {
        title: 'Reset Password',
        error: 'Email is required!',
      });
    }

    debug(`reset password "${email}"`);
    const user = await db.getUserByEmail(email);
    if (user) {
      await sendgrid.sendResetPassword(user);
    }

    res.render('account/reset_password', {
      title: 'Reset Password',
      emailSent: true,
    });
  } catch (err) {
    next(err);
  }
});
router.get('/reset_password/:token', async (req, res, next) => {
  try {
    const token = req.params.token;
    const secret = config.get('sendgrid.secret');
    const payload = jwt.verify(token, secret);
    debug('reset password', payload);
    if (payload.type != 'reset_password') {
      throw new Error('invalid token type');
    }
    res.render('account/reset_password', {
      title: 'Reset Password',
      emailReceived: true,
      tokenPayload: payload,
    });
  } catch (err) {
    next(err);
  }
});
router.post('/reset_password/:token', async (req, res, next) => {
  try {
    const token = req.params.token;
    const secret = config.get('sendgrid.secret');
    const payload = jwt.verify(token, secret);
    debug('reset password', payload);
    if (payload.type != 'reset_password') {
      throw new Error('invalid token type');
    }

    const newPassword = req.body.new_password;
    const confirmPassword = req.body.confirm_password;
    if (!newPassword || !confirmPassword || newPassword != confirmPassword) {
      return res.status(400).render('account/reset_password', {
        title: 'Reset Password',
        emailReceived: true,
        tokenPayload: payload,
        error: 'Passwords must match!',
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      config.get('auth.saltRounds')
    );
    await db.updatePasswordHash(payload.id, hashedPassword);

    res.render('account/reset_password', {
      title: 'Reset Password',
      passwordChanged: true,
      tokenPayload: payload,
    });
  } catch (err) {
    next(err);
  }
});
router.get('/profile/me', auth, (req, res) => {
  const auth = req.auth;
  res.render('account/profile', {
    title: 'Profile',
    user: auth,
    auth: auth,
    showVerifyEmail: true, // !auth.is_email_verified,
  });
});
router.get('/profile/:id', auth, admin, async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await db.getUserById(id);
    if (user) {
      res.render('account/profile', { title: 'Profile', user, auth: req.auth });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

// export router
module.exports = router;
