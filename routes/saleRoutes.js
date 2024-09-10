const express = require('express')
const {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
  getSalesCountByDate,
  getSumOfPaidAmounts,
  getTotalrevenue,
  getSumRemainingAmount,
  getTotalIncomeByDate,
  getTopUnbalancedProductsByDate,
  getTopProfitableUnbalancedProductsByDate,
  deleteAllSales,
} = require('../controllers/saleController')

const router = express.Router()

// Create a new sale
router.post('/', createSale)

// Get all sales
router.get('/', getSales)
router.delete('/', deleteAllSales)

// Get a single sale by ID
router.get('/:id', getSaleById)

// Update a sale by ID
router.put('/:id', updateSale)

// Delete a sale by ID
router.delete('/:id', deleteSale)

router.get('/count/:date', getSalesCountByDate)

router.get('/sum-paid-amounts/:date', getSumOfPaidAmounts)

router.get('/sum-total-amounts/:date', getTotalrevenue)

router.get('/sum-remaining-amounts/:date', getSumRemainingAmount)

router.get('/sum-total-incomes/:date', getTotalIncomeByDate)

router.get(
  '/top-saled-unbalanced-products/:date',
  getTopUnbalancedProductsByDate,
)

router.get(
  '/top-profit-unbalanced-products/:date',
  getTopProfitableUnbalancedProductsByDate,
)

module.exports = router
