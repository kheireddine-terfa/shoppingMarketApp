const { ProductSale, Product } = require('../models')
const catchAsync = require('../utils/catchAsync')

// Create a new ProductSale with productId and saleId
const createProductSale = catchAsync(async (req, res, next) => {
  const { quantity, productId, saleId } = req.body

  const productSale = await ProductSale.create({
    quantity,
    productId,
    saleId,
  })
  res.status(201).json(productSale)
})
// Retrieve all product sales,
const getAllProductSales = catchAsync(async (req, res, next) => {
  const productSales = await ProductSale.findAll({})
  res.status(200).json(productSales)
})
// Retrieve a specific ProductSale by ID
const getProductSaleById = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const productSale = await ProductSale.findAll({
    where: {
      saleId: id,
    },
    include: [
      {
        model: Product,
        as: 'Product',
      },
    ],
  })
  res.status(200).json(productSale)
})

// Update a ProductSale's quantity by ID
const updateProductSale = catchAsync(async (req, res, next) => {
  const { saleId } = req.params
  const { quantity } = req.body
  const productSale = await ProductSale.findAll({
    where: { saleId },
  })
  await productSale.update({ quantity })
  res.status(200).json(productSale)
})

// Delete a ProductSale by ID
const deleteProductSale = catchAsync(async (req, res, next) => {
  const { saleId } = req.params
  await ProductSale.destroy({
    where: { saleId },
  })
  res.status(204).send()
})
const deleteAllSales = catchAsync(async (req, res, next) => {
  await ProductSale.destroy({ where: {}, truncate: true })

  // Reset the auto-increment sequence (for SQLite)
  await ProductSale.sequelize.query(
    "DELETE FROM sqlite_sequence WHERE name='ProductSales';",
  )

  res.status(200).json({ message: 'All Sales  deleted successfully' })
})
module.exports = {
  createProductSale,
  getProductSaleById,
  updateProductSale,
  deleteProductSale,
  deleteAllSales,
  getAllProductSales,
}
