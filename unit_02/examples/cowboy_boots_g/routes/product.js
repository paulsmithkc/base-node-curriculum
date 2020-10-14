const express = require('express');
const db = require('../db');
//const debug = require('debug')('app:routes:product');

// create and configure router
const router = express.Router();

// eslint-disable-next-line no-unused-vars
router.get('/', async (req, res, next) => {
  try {
    const category = req.query.category;
    const search = req.query.search;

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
    const products = await query;

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

    res.render('product/list', {
      title: 'Product List',
      products,
      category,
      categoryOptionList,
      search,
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
