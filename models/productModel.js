// models/productModel.js
const db = require('../database')

const createProduct = (name, price, callback) => {
  db.run(
    'INSERT INTO product (name, price) VALUES (?, ?)',
    [name, price],
    function (err) {
      if (err) {
        return callback(err)
      }
      callback(null, { id: this.lastID })
    },
  )
}

const getProducts = (callback) => {
  db.all('SELECT * FROM product', [], (err, rows) => {
    if (err) {
      return callback(err)
    }
    callback(null, rows)
  })
}

module.exports = {
  createProduct,
  getProducts,
}
