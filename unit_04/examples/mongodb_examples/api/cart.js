const debug = require('debug')('app:api:cart');
const express = require('express');
const Joi = require('joi');
const db = require('../db');

const router = express.Router();
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.get('/', async (req, res, next) => {
  try {
    // validate inputs
    const schema = Joi.object({
      userId: Joi.objectId().required(),
    });
    let inputs = req.body;
    //inputs.userId = req.auth.userId;
    inputs = await schema.validateAsync(inputs, { abortEarly: false });

    // get shopping cart contents from database
    const cart = await db.getCartForUser(inputs.userId);
    // send response
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    // validate inputs
    const schema = Joi.object({
      userId: Joi.objectId().required(),
      productId: Joi.objectId().required(),
      quantity: Joi.number().default(1).min(1).max(1000),
    });
    let inputs = req.body;
    //inputs.userId = req.auth.userId;
    inputs = await schema.validateAsync(inputs, { abortEarly: false });

    // get product info from database
    const product = await db.getProductById(inputs.productId);
    if (!product) {
      throw new Error();
    }

    // update database
    await db.addToCart(inputs.userId, product, inputs.quantity);
    // send response
    res.json({
      inputs: inputs,
      product: product,
      message: 'Product Added To Cart.',
    });
  } catch (err) {
    next(err);
  }
});

// remove a product from the shopping cart
router.delete('/', async (req, res, next) => {
  try {
    // validate inputs
    const schema = Joi.object({
      userId: Joi.objectId().required(),
      productId: Joi.objectId().required(),
    });
    let inputs = req.body;
    //inputs.userId = req.auth.userId;
    inputs = await schema.validateAsync(inputs, { abortEarly: false });

    // update database
    await db.removeFromCart(inputs.userId, inputs.productId);
    // send response
    res.json({
      inputs: inputs,
      message: 'Product Removed From Cart.',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
