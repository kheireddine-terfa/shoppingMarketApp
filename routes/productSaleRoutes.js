const express = require('express')
const {
  createProductSale,
  getProductSaleById,
  updateProductSale,
  deleteProductSale,
  deleteAllSales,
  // getAllProductSales,
} = require('../controllers/productSaleController')
const { getSales } = require('../controllers/saleController')
const router = express.Router()

// Create a new product sale
router.post('/', createProductSale)

// Get all product sales
router.get('/', getSales)
// router.get('/', getAllProductSales)
router.delete('/', deleteAllSales)

// Get a single product sale by ID
router.get('/:id', getProductSaleById)

// Update a product sale by ID
router.put('/:id', updateProductSale)

// Delete a product sale by ID
router.delete('/:id', deleteProductSale)

module.exports = router
