const db = require('../db');
const express = require('express');
const debug = require('debug')('app:api:order');
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
    const orders = await db.getAllOrdersWithItemCount();
    res.json(orders);
  } catch (err) {
    sendError(err, res);
  }
});

// eslint-disable-next-line no-unused-vars
router.get('/:id', async (req, res, next) => {
  debug('get by id');
  try {
    const schema = Joi.number().min(1).required().label('id');
    const id = await schema.validateAsync(req.params.id);
    const order = await db.getOrderById(id);
    if (order) {
      order.items = await db.getOrderItems(id);
    }
    res.json(order);
  } catch (err) {
    sendError(err, res);
  }
});

// eslint-disable-next-line no-unused-vars
router.post('/', async (req, res, next) => {
  debug('insert');
  try {
    const schema = Joi.object({
      customer_id: Joi.number().min(1).required(),
      paid: Joi.bool(),
      shipped: Joi.bool(),
    });
    const data = await schema.validateAsync(req.body, { abortEarly: false });
    const result = await db.insertOrder({
      customer_id: data.customer_id,
      payment_date: data.paid ? Date.now() : null,
      ship_date: data.shipped ? Date.now() : null,
    });
    res.json({ id: result[0], message: 'Order Created.' });
  } catch (err) {
    sendError(err, res);
  }
});

// eslint-disable-next-line no-unused-vars
router.post('/:id/paid', async (req, res, next) => {
  debug('order paid');
  try {
    const schema = Joi.number().min(1).required().label('id');
    const id = await schema.validateAsync(req.params.id);
    await db.updateOrder({ id: id, payment_date: Date.now() });
    res.json({ message: 'Order Paid.' });
  } catch (err) {
    sendError(err, res);
  }
});

// eslint-disable-next-line no-unused-vars
router.post('/:id/shipped', async (req, res, next) => {
  debug('order shipped');
  try {
    const schema = Joi.number().min(1).required().label('id');
    const id = await schema.validateAsync(req.params.id);
    await db.updateOrder({ id: id, ship_date: Date.now() });
    res.json({ message: 'Order Shipped.' });
  } catch (err) {
    sendError(err, res);
  }
});

// eslint-disable-next-line no-unused-vars
router.get('/:id/items', async (req, res, next) => {
  debug('get order items');
  try {
    const schema = Joi.number().min(1).required().label('id');
    const id = await schema.validateAsync(req.params.id);
    const items = await db.getOrderItems(id);
    res.json(items);
  } catch (err) {
    sendError(err, res);
  }
});

// eslint-disable-next-line no-unused-vars
router.post('/:order_id/items', async (req, res, next) => {
  debug('add item to order');
  try {
    const schema = Joi.object({
      order_id: Joi.number().min(1).required(),
      product_id: Joi.number().min(1).required(),
      quantity: Joi.number().min(1).max(100).required(),
    });
    const data = {
      order_id: req.params.order_id,
      product_id: req.body.product_id,
      quantity: parseInt(req.body.quantity) || 1,
    };
    debug(data);
    await schema.validateAsync(data, { abortEarly: false });
    await db.addOrderItem(data);
    res.json({ message: 'Item Added to Order.' });
  } catch (err) {
    sendError(err, res);
  }
});

// eslint-disable-next-line no-unused-vars
router.delete('/:id', async (req, res, next) => {
  debug('delete');
  try {
    const schema = Joi.number().min(1).required().label('id');
    const id = await schema.validateAsync(req.params.id);
    await db.deleteOrder(id);
    res.json({ message: 'Order Deleted.' });
  } catch (err) {
    sendError(err, res);
  }
});

module.exports = router;
