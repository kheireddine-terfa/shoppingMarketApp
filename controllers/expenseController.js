const { Expense } = require('../models')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

const createExpense = catchAsync(async (req, res, next) => {
  const { date, description, amount } = req.body
  const expense = await Expense.create({ date, description, amount })
  res.status(201).json(expense)
})

const getExpenses = catchAsync(async (req, res, next) => {
  const expenses = await Expense.findAll()
  res.status(200).json(expenses)
})

const getExpenseById = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const expense = await Expense.findByPk(id)
  if (!expense) {
    return next(new AppError('expense not found !', 404))
  }
  res.status(200).json(expense)
})

const updateExpense = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { date, description, amount } = req.body
  const expense = await Expense.findByPk(id)
  if (!expense) {
    return next(new AppError('expense to update not found!', 404))
  }
  await expense.update({ date, description, amount })
  res.status(200).json(expense)
})

const deleteExpense = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const expense = await Expense.findByPk(id)
  if (!expense) {
    return next(new AppError('product to delete not found !', 404))
  }
  await expense.destroy()
  res.status(204).send()
})
const deleteAllExpenses = catchAsync(async (req, res, next) => {
  // Delete all Expenses from the database
  await Expense.destroy({ where: {}, truncate: true })

  // Reset the auto-increment sequence (for SQLite)
  await Expense.sequelize.query(
    "DELETE FROM sqlite_sequence WHERE name='Expenses';",
  )

  res.status(200).json({ message: 'All Expenses  deleted successfully' })
})
module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  deleteAllExpenses,
}
