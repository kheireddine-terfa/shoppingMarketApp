const Sequelize = require('sequelize');
const sequelize = require('../database');

const Product = require('./productModel')(sequelize, Sequelize);

sequelize.sync();

module.exports = {
  Product,
};
