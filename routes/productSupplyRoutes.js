const express = require('express');
const {
  createProductSupply,
  getProductSupplies,
  getProductSupplyById,
  updateProductSupply,
  deleteProductSupply
} = require('../controllers/productSupplyController');

const router = express.Router();

// Create a new product supply
router.post('/', createProductSupply);

// Get all product supplies
router.get('/', getProductSupplies);

// Get a single product supply by ID
router.get('/:id', getProductSupplyById);

// Update a product supply by ID
router.put('/', updateProductSupply);

// Delete a product supply by ID
router.delete('/:id', deleteProductSupply);

module.exports = router;
