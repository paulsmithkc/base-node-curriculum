// initialize environment variables
require('dotenv').config();

// import libraries
const debug = require('debug')('app:server');
const express = require('express');
const hbs = require('express-handlebars');
const config = require('config');
const moment = require('moment');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

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
      not: (value) => !value,
      eq: (a, b) => a == b,
      or: (a, b) => a || b,
      and: (a, b) => a && b,
      tern: (condition, a, b) => (condition ? a : b),
    },
  })
);
app.set('view engine', 'handlebars');
//app.use(morgan('tiny'));
app.use(cookieParser());

// routes
app.get('/', (req, res) => res.render('home'));
app.use('/account', require('./routes/account'));

// static files
app.use(express.static('public'));

// 404 error page
app.use(require('./middleware/error404'));
// 500 error page
app.use(require('./middleware/error500'));

// start app
const hostname = config.get('http.hostname');
const port = config.get('http.port');
app.listen(port, () => {
  debug(`Server running at http://${hostname}:${port}/`);
});
