// initialize environment variables
require('dotenv').config();

// import libraries
const debug = require('debug')('app:server');
const express = require('express');
const hbs = require('express-handlebars');
const config = require('config');
const moment = require('moment');
//const db = require('./db');

// create and configure application
const app = express();
app.engine(
  'handlebars',
  hbs({
    helpers: {
      formatPrice: (price) => (price ? '$' + price.toFixed(2) : ''),
      formatDate: (date) => (date ? moment(date).format('ll') : ''),
      formatDatetime: (date) => (date ? moment(date).format('lll') : ''),
      fromNow: (date) => (date ? moment(date).fromNow() : ''),
    },
  })
);
app.set('view engine', 'handlebars');
//app.use(express.urlencoded({ extended: false }));

// routes
app.get('/', (req, res) => res.redirect('/product')); // placeholder for home page
app.use('/product', require('./routes/product'));
app.use('/order', require('./routes/order'));
app.use('/customer', require('./routes/customer'));
app.use('/api/product', require('./api/product'));

// static files
app.use('/', express.static('public'));

// 404 error page
app.use((req, res) => {
  if (req.xhr || !req.accepts('html')) {
    res.status(404).json({ error: 'Page Not Found' });
  } else {
    res.status(404).render('error/basic', {
      title: 'Page Not Found',
      message: 'The page you requested could not be found.',
    });
  }
});

// 500 error 
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  debug(err.stack);
  const message = err.isJoi
    ? err.details.map((x) => x.message).join('\n')
    : err.message;

  if (req.xhr || !req.accepts('html')) {
    res.status(500).json({ error: message });
  } else {
    res.status(500).render('error/basic', { title: 'Error', message });
  }
});

// start app
const hostname = config.get('http.hostname');
const port = config.get('http.port');
app.listen(port, () => {
  debug(`Server running at http://${hostname}:${port}/`);
});
