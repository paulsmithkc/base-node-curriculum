// initialize environment variables
require('dotenv').config();

// import libraries
const debug = require('debug')('app:test');
const db = require('./db');

// test the database methods

const test = async () => {
  try {
    const conn = await db.connect();
    const results = await conn
      .collection('products')
      .aggregate(
        [
          {
            $match: {
              category: 'boots',
              price: { $gte: 10, $lte: 200 },
              $text: { $search: 'red leather boots' },
            },
          },
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
              price: 1,
              keywords: 1,
              colors: 1,
              //ratings: 1,
              ratingCount: { $size: '$ratings' },
              ratingAvg: { $avg: '$ratings.value' },
              relevance: { $meta: 'textScore' },
            },
          },
          //{ $match: { ratingAvg: { $gte: 3 } } },
          { $sort: { relevance: -1 } },
        ],
        { collation: { locale: 'en_US', strength: 1 } }
      )
      .toArray();

    debug(JSON.stringify(results, null, 2));
  } catch (err) {
    debug(err.stack);
  }
};

test();
