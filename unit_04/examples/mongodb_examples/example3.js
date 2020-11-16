// initialize environment variables
require('dotenv').config();

// import libraries
const debug = require('debug')('app:test');
const db = require('./db');

// test the database methods

const test = async () => {
  try {
    //const products = await db.getAllProducts();
    //debug(products);

    const userId = '5fb2cbe31e40a22c0d674e41';
    const product = await db.getProductById('5fadb05265f3535804039dcf');
    const quantity = 3;
    await db.addToCart(userId, product, quantity)

  } catch (err) {
    debug(err.stack);
  }
};

test();
