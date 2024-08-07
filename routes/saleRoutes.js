const express = require('express');
const {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale
} = require('../controllers/saleController');

const router = express.Router();

// Create a new sale
router.post('/', createSale);

// Get all sales
router.get('/', getSales);

// Get a single sale by ID
router.get('/:id', getSaleById);

// Update a sale by ID
router.put('/:id', updateSale);

// Delete a sale by ID
router.delete('/:id', deleteSale);

module.exports = router;
