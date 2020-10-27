const express = require('express');
const db = require('../db');

// create and configure router
const router = express.Router();

// implement routes

router.get('/login', (req, res) => res.render('account/login', {title: 'Login'}));
router.get('/me', (req, res) => res.render('account/profile', {title: 'Profile'}));
router.get('/logout', (req, res) => res.redirect('/'));

// export router
module.exports = router;
