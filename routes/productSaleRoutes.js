const express = require('express');
const {
  createProductSale,
  getProductSales,
  getProductSaleById,
  updateProductSale,
  deleteProductSale
} = require('../controllers/productSaleController');

const router = express.Router();

// Create a new product sale
router.post('/', createProductSale);

// Get all product sales
router.get('/', getProductSales);

// Get a single product sale by ID
router.get('/:id', getProductSaleById);

// Update a product sale by ID
router.put('/:id', updateProductSale);

// Delete a product sale by ID
router.delete('/:id', deleteProductSale);

module.exports = router;
