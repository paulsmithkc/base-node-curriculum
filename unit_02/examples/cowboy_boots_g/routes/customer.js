const express = require('express');
const db = require('../db');
const moment = require('moment');
//const debug = require('debug')('app:routes:customer');

// create and configure router
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const registered = req.query.registered;
    const search = req.query.search;

    let query = db.getAllCustomersWithOrderCount();
    if (registered) {
      const cutoff = moment().startOf('day').add(registered, 'days').toDate();
      query = query.where('register_date', '>=', cutoff);
    }
    if (search) {
      query = query.whereRaw(
        'MATCH (given_name,family_name,email) AGAINST (? IN NATURAL LANGUAGE MODE)',
        [search]
      );
    } else {
      query = query.orderBy('family_name').orderBy('given_name');
    }
    const customers = await query;

    const registerOptionList = {
      selected: registered || '',
      options: [
        { value: '', text: 'All Customers' },
        { value: '0', text: 'Registered Today' },
        { value: '-30', text: 'Registered in the last 30 days' },
        { value: '-90', text: 'Registered in the last 90 days' },
        { value: '-365', text: 'Registered in the past year' },
      ],
    };

    res.render('customer/list', {
      title: 'Customer List',
      customers,
      registered,
      registerOptionList,
      search,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const customer = await db.getCustomerById(customerId);
    if (customer) {
      const orders = await db
        .getCustomerOrders(customerId)
        .orderBy('id', 'desc');
      const title = `${customer.given_name} ${customer.family_name}`;
      res.render('customer/view', { title, customer, orders });
    } else {
      res.status(404).render('error/basic', { title: 'Customer Not Found' });
    }
  } catch (err) {
    next(err);
  }
});

// export router
module.exports = router;
