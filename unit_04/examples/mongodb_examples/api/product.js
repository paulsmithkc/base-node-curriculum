const debug = require('debug')('app:api:product');
const express = require('express');
const Joi = require('joi');
const db = require('../db');

const router = express.Router();
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.get('/all', async (req, res, next) => {
  try {
    const products = await db.getAllProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get('/category/:category', async (req, res, next) => {
  try {
    const category = req.params.category;
    const products = await db.getProductsByCategory(category);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get('/name/:name', async (req, res, next) => {
  try {
    const name = req.params.name;
    const products = await db.getProductByName(name);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await db.getProductById(id);
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required().min(3).max(100).trim(),
      category: Joi.string().required().min(3).max(7).trim(),
      price: Joi.number().required().min(0).max(9999.99).precision(2),
    });
    const product = await schema.validateAsync(req.body, { abortEarly: false });
    debug('insert product');
    debug(product);
    await db.insertProduct(product);
    res.json({ product: product, message: 'Product Added.' });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  debug('update product');
  try {
    const schema = Joi.object({
      _id: Joi.string().required(),
      name: Joi.string().required().min(3).max(100).trim(),
      category: Joi.string().required().min(3).max(7).trim(),
      price: Joi.number().required().min(0).max(9999.99).precision(2),
    });
    let product = req.body;
    product.id = req.params.id;
    product = await schema.validateAsync(product, { abortEarly: false });
    await db.updateProduct(product);
    res.json({ product: product, message: 'Product Updated.' });
  } catch (err) {
    sendError(err, res);
  }
});

router.delete('/:id', async (req, res, next) => {
  debug('delete product');
  try {
    const schema = Joi.string().required();
    const id = await schema.validateAsync(req.params.id);
    await db.deleteProduct(id);
    res.json({ id: id, message: 'Product Deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
