const express = require('express');
const db = require('../db');
const _ = require('lodash');
const moment = require('moment');
//const debug = require('debug')('app:routes:order');

// create and configure router
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const paid = req.query.paid;
    const search = req.query.search;

    let query = db.getAllOrdersWithItemCount();
    if (paid) {
      const cutoff = moment().startOf('day').add(paid, 'days').toDate();
      query = query.where('payment_date', '>=', cutoff);
    }
    if (search) {
      query = query.whereRaw(
        'MATCH (customers.given_name,customers.family_name,customers.email) AGAINST (? IN NATURAL LANGUAGE MODE)',
        [search]
      );
    } else {
      query = query.orderBy('id', 'desc');
    }
    const orders = await query;

    const paidOptionList = {
      selected: paid || '',
      options: [
        { value: '', text: 'All Orders' },
        { value: '0', text: 'Today' },
        { value: '-30', text: 'Last 30 days' },
        { value: '-90', text: 'Last 90 days' },
        { value: '-365', text: 'Past year' },
      ],
    };

    res.render('order/list', {
      title: 'Order List',
      orders,
      paid,
      paidOptionList,
      search,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await db.getOrderById(orderId);
    if (order) {
      const customer = await db.getCustomerById(order.customer_id);
      const items = await db.getOrderItems(orderId);
      const totalCost = _.sum(
        items.map((x) => x.quantity * (x.price_paid || x.list_price))
      );
      const title = `Order ${order.id}`;
      res.render('order/view', { title, customer, order, items, totalCost });
    } else {
      res.status(404).render('error/basic', { title: 'Order Not Found' });
    }
  } catch (err) {
    next(err);
  }
});

// export router
module.exports = router;
