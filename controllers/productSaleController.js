const { ProductSale, Product } = require('../models')

// Create a new ProductSale with productId and saleId
const createProductSale = async (req, res) => {
  try {
    const { quantity, productId, saleId } = req.body

    if (!quantity || !productId || !saleId) {
      return res
        .status(400)
        .json({ error: 'Quantity, productId, and saleId are required' })
    }

    const productSale = await ProductSale.create({
      quantity,
      productId,
      saleId,
    })
    res.status(201).json(productSale)
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to create product sale: ${error.message}` })
  }
}
// Retrieve all product sales,
const getAllProductSales = async (req, res) => {
  try {
    const productSales = await ProductSale.findAll({})
    res.status(200).json(productSales)
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch product sales: ${error.message}` })
  }
}
// Retrieve a specific ProductSale by ID
const getProductSaleById = async (req, res) => {
  try {
    const { id } = req.params
    console.log('URL  :', req.originalUrl)
    console.log('saleId  :', id)
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
  } catch (error) {
    res
      .status(404)
      .json({ error: `Failed to fetch product sale: ${error.message}` })
  }
}

// Update a ProductSale's quantity by ID
const updateProductSale = async (req, res) => {
  try {
    const { saleId } = req.params
    const { quantity } = req.body

    if (!quantity) {
      return res.status(400).json({ error: 'Quantity is required' })
    }

    const productSale = await ProductSale.findAll({
      where: { saleId },
    })
    await productSale.update({ quantity })
    res.status(200).json(productSale)
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to update product sale: ${error.message}` })
  }
}

// Delete a ProductSale by ID
const deleteProductSale = async (req, res) => {
  try {
    const { saleId } = req.params
    await ProductSale.destroy({
      where: { saleId },
    })
    res.status(204).send()
  } catch (error) {
    res
      .status(404)
      .json({ error: `Failed to delete product sale: ${error.message}` })
  }
}
const deleteAllSales = async (req, res) => {
  try {
    await ProductSale.destroy({ where: {}, truncate: true })

    // Reset the auto-increment sequence (for SQLite)
    await ProductSale.sequelize.query(
      "DELETE FROM sqlite_sequence WHERE name='ProductSales';",
    )

    res.status(200).json({ message: 'All Sales  deleted successfully' })
  } catch (error) {
    console.error('Error deleting Sales :', error)
    res.status(500).json({ error: error.message })
  }
}
module.exports = {
  createProductSale,
  getProductSaleById,
  updateProductSale,
  deleteProductSale,
  deleteAllSales,
  getAllProductSales,
}
