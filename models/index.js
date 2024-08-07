const Sequelize = require('sequelize')
const sequelize = require('../database')

const Product = require('./productModel')(sequelize, Sequelize)
const User = require('./userModel')(sequelize, Sequelize)

sequelize.sync()

module.exports = {
  Product,
  User,
}
