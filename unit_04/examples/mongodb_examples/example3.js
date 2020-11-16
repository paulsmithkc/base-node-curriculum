// initialize environment variables
require('dotenv').config();

// import libraries
const debug = require('debug')('app:test');
const db = require('./db');

// test the database methods

const test = async () => {
  try {
    const products = await db.getAllProducts();
    debug(products);
  } catch (err) {
    debug(err.stack);
  }
};

test();
