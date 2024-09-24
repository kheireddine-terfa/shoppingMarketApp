const { Supplier } = require('../models')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
// Handlers :
const createSupplier = catchAsync(async (req, res, next) => {
  const { name, address, phone_number } = req.body
  const supplier = await Supplier.create({ name, address, phone_number })
  res.status(201).json(supplier)
})

const getSuppliers = catchAsync(async (req, res, next) => {
  const suppliers = await Supplier.findAll()
  res.status(200).json(suppliers)
})

const getSupplierById = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const supplier = await Supplier.findByPk(id)
  if (!supplier) {
    return next(new AppError('Supplier Not Found', 404))
  }
  res.status(200).json(supplier)
})

const updateSupplier = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { name, address, phone_number } = req.body
  const supplier = await Supplier.findByPk(id)
  if (!supplier) {
    return next(new AppError('Supplier to Update Not Found', 404))
  }
  await supplier.update({ name, address, phone_number })
  res.status(200).json(supplier)
})

const deleteSupplier = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const supplier = await Supplier.findByPk(id)
  if (!supplier) {
    return next(new AppError('Supplier To Delete Not Found !', 404))
  }
  await supplier.destroy()
  res.status(204).send()
})
const deleteAllSuppliers = catchAsync(async (req, res, next) => {
  // Delete all suppliers from the database
  await Supplier.destroy({ where: {}, truncate: true })

  // Reset the auto-increment sequence (for SQLite)
  await Supplier.sequelize.query(
    "DELETE FROM sqlite_sequence WHERE name='Suppliers';",
  )

  res.status(200).json({ message: 'All Suppliers  deleted successfully' })
})
module.exports = {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  deleteAllSuppliers,
}
