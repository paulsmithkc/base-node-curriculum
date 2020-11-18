// initialize environment variables
require('dotenv').config();

// import libraries
const debug = require('debug')('app:test');
const db = require('./db');

// test the database methods

const test = async () => {
  try {
    const database = await db.connect();
    const products = await database
      .collection('products')
      .find({
        $text: { $search: 'red leather boots' },
      })
      .project({
        relevance: { $meta: 'textScore' },
      })
      .toArray();
    debug(products);
  } catch (err) {
    debug(err.stack);
  }
};

test();
