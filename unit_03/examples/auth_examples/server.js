// initialize environment variables
require('dotenv').config();

// import libraries
const debug = require('debug')('app:server');
const express = require('express');
const hbs = require('express-handlebars');
const config = require('config');
const morgan = require('morgan');

// create and configure application
const app = express();
app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');
app.use(morgan('tiny'));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/account', require('./routes/account'));

// static files
app.use('/', express.static('public'));

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
