const express = require('express')
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductPhoto,
  deleteAllProducts,
} = require('../controllers/productController')

const router = express.Router()

// Create a new product
router.post('/', uploadProductPhoto, createProduct)

// Get all products
router.get('/', getProducts)
// Delete All Products :
router.delete('/', deleteAllProducts)
// Get a single product by ID
router.get('/:id', getProductById)

// Update a product by ID
router.put('/:id', updateProduct)

// Delete a product by ID
router.delete('/:id', deleteProduct)

module.exports = router
