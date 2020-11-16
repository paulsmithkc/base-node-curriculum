const { MongoClient } = require('mongodb');

const run = async () => {
  try {
    const dbUrl = 'mongodb://localhost:27017';
    const dbName = 'cowboy_boots';
    const client = await MongoClient.connect(dbUrl);
    const database = client.db(dbName);
    const collection = database.collection('products');
    const product = await collection.findOne({ name: 'Red Boots' });
    console.log(product);
  } catch (err) {
    console.error(err);
  }
}

run();
