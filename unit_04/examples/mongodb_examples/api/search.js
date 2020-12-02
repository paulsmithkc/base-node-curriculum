const debug = require('debug')('app:api:search');
const express = require('express');
const Joi = require('joi');
const db = require('../db');

const router = express.Router();
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.get('/', async (req, res, next) => {
  try {
    const q = req.query.q;
    const category = req.query.category;
    const color = req.query.color;
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);
    const minRating = parseFloat(req.query.minRating);
    const sortBy = req.query.sortBy;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 100;
    const collation = { locale: 'en_US', strength: 1 };

    const matchStage = {};
    if (q) {
      matchStage.$text = { $search: q };
    }
    if (category) {
      matchStage.category = { $eq: category };
    }
    if (color) {
      matchStage.colors = { $eq: color };
    }
    if (minPrice && maxPrice) {
      matchStage.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      matchStage.price = { $gte: minPrice };
    } else if (maxPrice) {
      matchStage.price = { $lte: maxPrice };
    }

    let sortStage = null;
    switch (sortBy) {
      case 'name':
        sortStage = { name: 1 };
        break;
      case 'rating':
        sortStage = { ratingAvg: -1 };
        break;
      case 'lowest price':
        sortStage = { price: 1 };
        break;
      case 'highest price':
        sortStage = { price: -1 };
        break;
      case 'relevance':
      default:
        sortStage = q ? { relevance: -1 } : { name: 1 };
        break;
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'ratings',
          localField: '_id',
          foreignField: 'productId',
          as: 'ratings',
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          category: 1,
          price: 1,
          keywords: 1,
          colors: 1,
          ratingCount: { $size: '$ratings' },
          ratingAvg: { $avg: '$ratings.value' },
          relevance: q ? { $meta: 'textScore' } : null,
        },
      },
      {
        $match: minRating ? { ratingAvg: { $gte: minRating } } : {},
      },
      { $sort: sortStage },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
    ];

    const conn = await db.connect();
    const cursor = conn
      .collection('products')
      .aggregate(pipeline, { collation: collation });

    // const results = await cursor.toArray();
    // return res.json(results);

    // res.type('application/json');
    // res.write('[\n');
    // cursor.on('data', (doc) => res.write(JSON.stringify(doc) + ',\n'));
    // cursor.on('end', () => res.end('null]'));
    // cursor.on('error', (err) => next(err));

    res.type('application/json');
    res.write('[\n');
    for await (const doc of cursor) {
      res.write(JSON.stringify(doc));
      res.write(',\n');
    }
    res.end('null]');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
