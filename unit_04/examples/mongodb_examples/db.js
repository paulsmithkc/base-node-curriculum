const debug = require('debug')('app:db');
const config = require('config');
const { MongoClient, ObjectID } = require('mongodb');

let _database = null;

const connect = async () => {
  if (!_database) {
    const dbUrl = config.get('db.url');
    const dbName = config.get('db.name');
    const poolSize = config.get('db.poolSize');
    const client = await MongoClient.connect(dbUrl, {
      useUnifiedTopology: true,
    });
    _database = client.db(dbName, { poolSize });
  }
  return _database;
};

const getAllProducts = async () => {
  const database = await connect();
  return database.collection('products').find({}).toArray();
};

const getProductsByCategory = async (category) => {
  const database = await connect();
  return database.collection('products').find({ category: category }).toArray();
};

const getProductByName = async (name) => {
  const database = await connect();
  return database.collection('products').findOne({ name: name });
};

const getProductById = async (id) => {
  const database = await connect();
  return database.collection('products').findOne({
    _id: new ObjectID(id),
  });
};

const insertProduct = async (product) => {
  const database = await connect();
  return database.collection('products').insertOne(product);
};

const insertProducts = async (products) => {
  const database = await connect();
  return database.collection('products').insertMany(products);
};

const updateProduct = async (product) => {
  const database = await connect();
  return database.collection('products').updateOne(
    { _id: new ObjectID(product._id) },
    {
      $set: {
        name: product.name,
        category: product.category,
        price: product.price,
      },
    }
  );
};

const doPriceCut = async () => {
  const database = await connect();
  return database
    .collection('products')
    .updateMany(
      { isOnSale: false, price: { $gt: 5 } },
      { $set: { isOnSale: true }, $mul: { price: 0.7 } }
    );
};

const deleteProductById = async (id) => {
  const database = await connect();
  return database.collection('products').deleteOne({ _id: new ObjectID(id) });
};

const deleteOutOfStock = async () => {
  const database = await connect();
  return database.collection('products').deleteMany({ quantity: 0 });
};

const getCartForUser = async (userId) => {
  const database = await connect();
  return database
    .collection('carts')
    .find({ userId: new ObjectID(userId) })
    .toArray();
};

const addToCart = async (userId, product, quantity = 1) => {
  const database = await connect();
  return database.collection('carts').updateOne(
    {
      userId: new ObjectID(userId),
      productId: new ObjectID(product._id),
    },
    {
      $setOnInsert: {
        userId: new ObjectID(userId),
        productId: new ObjectID(product._id),
        productName: product.name,
        productPrice: product.price,
      },
      $inc: { quantity: quantity },
    },
    { upsert: true }
  );
};

const removeFromCart = async (userId, productId) => {
  const database = await connect();
  return database.collection('carts').deleteMany({
    userId: new ObjectID(userId),
    productId: new ObjectID(productId),
  });
};

module.exports = {
  connect,
  getAllProducts,
  getProductsByCategory,
  getProductByName,
  getProductById,
  insertProduct,
  insertProducts,
  updateProduct,
  doPriceCut,
  deleteProductById,
  deleteOutOfStock,
  getCartForUser,
  addToCart,
  removeFromCart,
};
