// models/productModel.js
const db = require('../database');

const createProduct = (name, price, bare_code, quantity, min_quantity, callback) => {
  db.run(
    'INSERT INTO product (name, price, bare_code, quantity, min_quantity) VALUES (?, ?, ?, ?, ?)',
    [name, price, bare_code, quantity, min_quantity],
    function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID });
    }
  );
};

const getProducts = (callback) => {
  db.all('SELECT * FROM product', [], (err, rows) => {
    if (err) {
      return callback(err);
    }
    callback(null, rows);
  });
};

module.exports = {
  createProduct,
  getProducts,
};
