// controllers/productController.js
const productModel = require('../models/productModel')

const addProduct = (req, res) => {
  const { name, price } = req.body
  productModel.createProduct(name, price, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.status(200).json(result)
  })
}

const getAllProducts = (req, res) => {
  productModel.getProducts((err, products) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.status(200).json(products)
  })
}

module.exports = {
  addProduct,
  getAllProducts,
}
