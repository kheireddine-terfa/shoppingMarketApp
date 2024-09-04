const express = require('express')
const {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  deleteAllSuppliers,
} = require('../controllers/supplierController')

const router = express.Router()

// Create a new supplier
router.post('/', createSupplier)

// Get all suppliers
router.get('/', getSuppliers)
// Get all suppliers
router.delete('/', deleteAllSuppliers)

// Get a single supplier by ID
router.get('/:id', getSupplierById)

// Update a supplier by ID
router.put('/:id', updateSupplier)

// Delete a supplier by ID
router.delete('/:id', deleteSupplier)

module.exports = router
