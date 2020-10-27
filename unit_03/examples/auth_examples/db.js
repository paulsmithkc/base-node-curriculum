const debug = require('debug')('app:db');

// get connection config
const config = require('config');
const databaseConfig = config.get('db');

// connect to the database
const knex = require('knex')({
  client: 'mysql',
  connection: databaseConfig,
});

// users

const getAllUsers = () => {
  return knex('users').select('*');
};

const getUserById = (id) => {
  return knex('users').select('*').where('id', id).first();
};

const getUserByName = (username) => {
  return knex('users').select('*').where('username', username).first();
};

const getUserByEmail = (email) => {
  return knex('users').select('*').where('email', email).first();
};

module.exports = {
  knex,
  getAllUsers,
  getUserById,
  getUserByName,
  getUserByEmail,
};
