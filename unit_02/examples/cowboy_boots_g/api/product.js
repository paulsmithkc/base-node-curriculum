const db = require('../db');
const express = require('express');
const debug = require('debug')('app:api:product');
const Joi = require('joi');

const router = express.Router();
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

const sendError = (err, res) => {
  debug(err);
  if (err.isJoi) {
    res.json({ error: err.details.map((x) => x.message + '.').join('\n') });
  } else {
    res.json({ error: err.message });
  }
};

// eslint-disable-next-line no-unused-vars
router.get('/', async (req, res, next) => {
  debug('get all');
  try {
    const products = await db.getAllProducts();
    res.json(products);
  } catch (err) {
    sendError(err, res);
  }
});

// eslint-disable-next-line no-unused-vars
router.get('/id/:id', async (req, res, next) => {
  debug('find by id');
  try {
    const schema = Joi.number().min(1).required().label('id');
    const id = await schema.validateAsync(req.params.id);
    const product = await db.findProductById(id);
    res.json(product);
  } catch (err) {
    sendError(err, res);
  }
});

// eslint-disable-next-line no-unused-vars
router.get('/name/:name', async (req, res, next) => {
  debug('find by name');
  try {
    const schema = Joi.string().required().trim().label('name');
    const name = await schema.validateAsync(req.params.name);
    const products = await db.findProductByName(name);
    res.json(products);
  } catch (err) {
    sendError(err, res);
  }
});

// eslint-disable-next-line no-unused-vars
router.get('/category/:category', async (req, res, next) => {
  debug('find by category');
  try {
    const schema = Joi.string().required().trim().label('category');
    const category = await schema.validateAsync(req.params.category);
    const products = await db.findProductByCategory(category);
    res.json(products);
  } catch (err) {
    sendError(err, res);
  }
});

// eslint-disable-next-line no-unused-vars
router.post('/', async (req, res, next) => {
  debug('insert');
  try {
    const schema = Joi.object({
      name: Joi.string().required().min(3).max(100).trim(),
      category: Joi.string().required().min(3).max(7).trim(),
      price: Joi.number().required().min(0).max(9999.99).precision(2),
    });
    const product = await schema.validateAsync(req.body, { abortEarly: false });
    const result = await db.insertProduct(product);
    res.json({ id: result[0], message: 'Product Added.' });
  } catch (err) {
    sendError(err, res);
  }
});

// eslint-disable-next-line no-unused-vars
router.put('/:id', async (req, res, next) => {
  debug('update');
  try {
    const schema = Joi.object({
      id: Joi.number().required().min(1),
      name: Joi.string().required().min(3).max(100).trim(),
      category: Joi.string().required().min(3).max(7).trim(),
      price: Joi.number().required().min(0).max(9999.99).precision(2),
    });
    let product = req.body;
    product.id = req.params.id;
    product = await schema.validateAsync(product, { abortEarly: false });
    await db.updateProduct(product);
    res.json({ message: 'Product Updated.' });
  } catch (err) {
    sendError(err, res);
  }
});

// eslint-disable-next-line no-unused-vars
router.delete('/:id', async (req, res, next) => {
  debug('delete');
  try {
    const schema = Joi.number().min(1).required();
    const id = await schema.validateAsync(req.params.id);
    await db.deleteProduct(id);
    res.json({ message: 'Product Deleted.' });
  } catch (err) {
    sendError(err, res);
  }
});

module.exports = router;
