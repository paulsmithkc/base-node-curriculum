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

const getProductById = async (id) => {
  const database = await connect();
  return database.collection('products').findOne({
    _id: new ObjectID(id),
  });
};

const getProductByName = async (name) => {
  const database = await connect();
  return database.collection('products').findOne({ name: name });
};

const insertProduct = async (product) => {
  const database = await connect();
  await database.collection('product').insertOne(product);
};

const insertProducts = async (products) => {
  const database = await connect();
  await database.collection('product').insertMany(products);
};

const updateProduct = async (product) => {
  const database = await connect();
  await database
    .collection('product')
    .updateOne(
      { _id: new ObjectID(product._id) },
      { $set: { name: product.name, price: product.price } }
    );
};

const deleteProductById = async () => {
  const database = await connect();
  await database.collection('product').deleteOne({ _id: new ObjectID(id) });
};

const deleteOutOfStock = async () => {
  const database = await connect();
  await database.collection('product').deleteMany({ quantity: 0 });
};

module.exports = {
  connect,
  getAllProducts,
  getProductsByCategory,
  getProductById,
  getProductByName,
  insertProduct,
  insertProducts,
  updateProduct,
  deleteProductById,
  deleteOutOfStock,
};
