const express = require('express');
const db = require('../db');
const pagerUtils = require('../pager-utils');
//const debug = require('debug')('app:routes:product');

// create and configure router
const router = express.Router();

// eslint-disable-next-line no-unused-vars
router.get('/', async (req, res, next) => {
  try {
    const category = req.query.category;
    const search = req.query.search;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const pageNumber = parseInt(req.query.page) || 1;

    const categoryOptionList = {
      selected: category || '',
      options: [
        { value: '', text: 'All Categories' },
        { value: 'Hats', text: 'Hats' },
        { value: 'Buckles', text: 'Buckles' },
        { value: 'Boots', text: 'Boots' },
        { value: 'Other', text: 'Other' },
      ],
    };

    let query = db.getAllProducts();
    if (category) {
      query = query.where('category', category);
    }
    if (search) {
      query = query.whereRaw(
        'MATCH (name,category) AGAINST (? IN NATURAL LANGUAGE MODE)',
        [search]
      );
    } else {
      query = query.orderBy('name');
    }

    const pager = await pagerUtils.getPager(
      query,
      pageSize,
      pageNumber,
      req.originalUrl
    );
    //debug(`pager = ${JSON.stringify(pager, null, 2)}`);

    const products = await query
      .limit(pageSize)
      .offset(pageSize * (pageNumber - 1));

    res.render('product/list', {
      title: 'Product List',
      products,
      category,
      categoryOptionList,
      search,
      pager,
    });
  } catch (err) {
    next(err);
  }
});

// eslint-disable-next-line no-unused-vars
router.get('/add', (req, res, next) => {
  res.render('product/add', { title: 'Add Product' });
});

router.get('/edit/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await db.findProductById(id);
    if (product) {
      res.render('product/edit', { title: 'Edit Product', product });
    } else {
      res.status(404).render('error/basic', { title: 'Product Not Found' });
    }
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await db.findProductById(id);
    if (product) {
      res.render('product/view', { title: product.name, product });
    } else {
      res.status(404).render('error/basic', { title: 'Product Not Found' });
    }
  } catch (err) {
    next(err);
  }
});

// export router
module.exports = router;
