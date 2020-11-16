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
  await database.collection('products').insertOne(product);
};

const insertProducts = async (products) => {
  const database = await connect();
  await database.collection('products').insertMany(products);
};

const updateProduct = async (product) => {
  const database = await connect();
  await database.collection('products').updateOne(
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

const deleteProductById = async (id) => {
  const database = await connect();
  await database.collection('products').deleteOne({ _id: new ObjectID(id) });
};

const deleteOutOfStock = async () => {
  const database = await connect();
  await database.collection('products').deleteMany({ quantity: 0 });
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
  deleteProductById,
  deleteOutOfStock,
};
