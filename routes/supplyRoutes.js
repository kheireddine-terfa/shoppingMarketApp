const express = require('express')
const {
  createSupply,
  getSupplies,
  getSupplyById,
  updateSupply,
  deleteSupply,
  deleteAllSupplies,
} = require('../controllers/supplyController')

const router = express.Router()

// Create a new  supply
router.post('/', createSupply)

// Get all  supplies
router.get('/', getSupplies)

// Get all  supplies
router.delete('/', deleteAllSupplies)

// Get a single  supply by ID
router.get('/:id', getSupplyById)

// Update a  supply by ID
router.put('/:id', updateSupply)

// Delete a  supply by ID
router.delete('/:id', deleteSupply)

module.exports = router
