const express = require('express');
const {
  createExpirationDate,
  getExpirationDates,
  getExpirationDateById,
  updateExpirationDate,
  deleteExpirationDate,
  getExpirationDateBySupplyId,
} = require('../controllers/expirationDateController');

const router = express.Router();

// Create a new expiration date
router.post('/', createExpirationDate);

// Get all expiration dates
router.get('/', getExpirationDates);

// Get a single expiration date by ID
router.get('/:id', getExpirationDateById);

router.get('/supply/:supplyId', getExpirationDateBySupplyId);

// Update an expiration date by ID
router.put('/', updateExpirationDate);

// Delete an expiration date by ID
router.delete('/:id', deleteExpirationDate);

module.exports = router;
