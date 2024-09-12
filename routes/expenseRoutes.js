const express = require('express')
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  deleteAllExpenses,
} = require('../controllers/expenseController')

const router = express.Router()

// Create a new expense
router.post('/', createExpense)

// Get all expenses
router.get('/', getExpenses)
router.delete('/', deleteAllExpenses)

// Get a single expense by ID
router.get('/:id', getExpenseById)

// Update an expense by ID
router.put('/:id', updateExpense)

// Delete an expense by ID
router.delete('/:id', deleteExpense)

module.exports = router
