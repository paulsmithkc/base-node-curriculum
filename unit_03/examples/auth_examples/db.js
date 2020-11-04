const debug = require('debug')('app:db');
const moment = require('moment');

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

const updateLastLogin = (userId) => {
  return knex('users')
    .update('lastLogin', moment().format('YYYY-MM-DD HH:mm:ss'))
    .where('id', userId);
};

const updateEmailVerified = (userId, verified) => {
  return knex('users')
    .update('is_email_verified', verified)
    .where('id', userId);
};

module.exports = {
  knex,
  getAllUsers,
  getUserById,
  getUserByName,
  getUserByEmail,
  updateLastLogin,
  updateEmailVerified,
};
