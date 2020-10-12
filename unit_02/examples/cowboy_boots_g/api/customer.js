const db = require('../db');
const express = require('express');
const debug = require('debug')('app:api:customer');
const Joi = require('joi');

const router = express.Router();
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

const sendError = (err, res) => {
  debug(err);
  if (err.isJoi) {
    res.json({ error: err.details.map((x) => x.message).join('\n') });
  } else {
    res.json({ error: err.message });
  }
};

// eslint-disable-next-line no-unused-vars
router.get('/', async (req, res, next) => {
  debug('get all');
  try {
    const orders = await db.getAllCustomersWithOrderCount();
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
    const customer = await db.getCustomerById(id);
    res.json(customer);
  } catch (err) {
    sendError(err, res);
  }
});

// eslint-disable-next-line no-unused-vars
router.post('/', async (req, res, next) => {
  debug('register');
  try {
    const schema = Joi.object({
      given_name: Joi.string().required().max(100).trim(),
      family_name: Joi.string().required().max(100).trim(),
      email: Joi.string().required().email().max(200).trim().lowercase(),
      password: Joi.string().required()
    });
    const customer = await schema.validateAsync(req.body, { abortEarly: false });
    const result = await db.insertCustomer(customer);
    res.json(result);
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
    const result = await db.deleteCustomer(id);
    res.json(result);
  } catch (err) {
    sendError(err, res);
  }
});

module.exports = router;
