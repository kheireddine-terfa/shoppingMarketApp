const { Sale, ProductSale, Product } = require('../models')
const { Op } = require('sequelize')
const { sequelize } = require('../models') // Use require instead of import
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

async function getSalesCountByDate(req, res) {
  try {
    const { date } = req.params // Assuming the date is passed as a URL parameter
    const salesCount = await Sale.count({
      where: {
        date: {
          [Op.startsWith]: date, // Use Sequelize's Op.startsWith operator for comparison
        },
      },
    })

    res.json({ salesCount })
  } catch (error) {
    console.error('Error fetching sales count:', error)
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the sales count.' })
  }
}

async function getTopUnbalancedProductsByDate(req, res) {
  const { date } = req.params // Assuming the date is passed as a URL parameter in the format 'YYYY-MM'

  try {
    const TopSaledProducts = await sequelize.query(
      `SELECT
          p.id,
          p.name,
          SUM(ps.quantity) AS total_quantity_sold
       FROM
          ProductSales ps
       JOIN
          Products p ON ps.productId = p.id
       WHERE
          ps.createdAt LIKE :date
          AND p.balanced_product = false
       GROUP BY
          p.id, p.name
       ORDER BY
          total_quantity_sold DESC
       LIMIT 6`,
      {
        replacements: { date: `${date}%` }, // Add '%' wildcard to the date parameter for LIKE
        type: sequelize.QueryTypes.SELECT,
      },
    )

    return res.json({ TopSaledProducts })
  } catch (error) {
    console.error('Error fetching top unbalanced products:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

async function getTopProfitableUnbalancedProductsByDate(req, res) {
  const { date } = req.params // Assuming the date is passed as a URL parameter in the format 'YYYY-MM'

  try {
    const topProfitableUnbalancedProducts = await sequelize.query(
      `SELECT
          p.id,
          p.name,
          SUM((p.price - p.purchase_price) * ps.quantity) AS total_profit
       FROM
          ProductSales ps
       JOIN
          Products p ON ps.productId = p.id
       WHERE
          ps.createdAt LIKE :date
          AND p.balanced_product = false
       GROUP BY
          p.id, p.name
       ORDER BY
          total_profit DESC
       LIMIT 6`,
      {
        replacements: { date: `${date}%` }, // Add '%' wildcard to the date parameter for LIKE
        type: sequelize.QueryTypes.SELECT,
      },
    )

    return res.json({ topProfitableUnbalancedProducts })
  } catch (error) {
    console.error('Error fetching top profitable unbalanced products:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

async function getTotalIncomeByDate(req, res) {
  const { date } = req.params // Assuming the date is passed as a URL parameter
  try {
    const result = await sequelize.query(
      `SELECT
          SUM(
              (p.price - p.purchase_price) * 
              CASE
                  WHEN p.balanced_product = true THEN ps.quantity / 1000.0
                  ELSE ps.quantity
              END
          ) AS total_income
       FROM
          ProductSales ps
       JOIN
          Products p ON ps.productId = p.id
       WHERE
          ps.createdAt LIKE :date`, // Use LIKE to match the date pattern
      {
        replacements: { date: `${date}%` }, // Add '%' wildcard to the date parameter for LIKE
        type: sequelize.QueryTypes.SELECT,
      },
    )

    // Extract the total income from the result
    const totalIncome = result[0]?.total_income || 0

    // Send the total income as a JSON response
    res.json({ totalIncome })
  } catch (error) {
    console.error('Error fetching total income:', error)
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the total income.' })
  }
}

async function getTotalrevenue(req, res) {
  try {
    const { date } = req.params // Assuming the date is passed as a URL parameter
    const cash = await Sale.sum('amount', {
      where: {
        createdAt: {
          [Op.startsWith]: date, // Use Sequelize's Op.startsWith operator for comparison
        },
      },
    })

    res.json({ cash })
  } catch (error) {
    console.error('Error fetching sum:', error)
    res.status(500).json({
      error: 'An error occurred while fetching the sum of paid amounts.',
    })
  }
}

async function getSumRemainingAmount(req, res) {
  try {
    const { date } = req.params // Assuming the date is passed as a URL parameter

    // Calculate the sum of remaining_amount for the given date
    const sumRemainingAmount = await Sale.sum('remaining_amount', {
      where: {
        date: {
          [Op.startsWith]: date, // Use Sequelize's Op.startsWith operator for comparison
        },
      },
    })

    res.json({ sumRemainingAmount }) // Return the sum with a key
  } catch (error) {
    console.error('Error fetching sum of remaining amounts:', error)
    res.status(500).json({
      error: 'An error occurred while fetching the sum of remaining amounts.',
    })
  }
}

async function getSumOfPaidAmounts(req, res) {
  try {
    const { date } = req.params // Assuming the date is passed as a URL parameter
    const revenuesSum = await Sale.sum('paid_amount', {
      where: {
        createdAt: {
          [Op.startsWith]: date, // Use Sequelize's Op.startsWith operator for comparison
        },
      },
    })

    res.json({ revenuesSum })
  } catch (error) {
    console.error('Error fetching sum:', error)
    res.status(500).json({
      error: 'An error occurred while fetching the sum of paid amounts.',
    })
  }
}
// You Need to wrrap the function inside the catchAsync function and also use the AppError Class to send custom errors above ..AZ
const createSale = catchAsync(async (req, res, next) => {
  const { date, amount, paid_amount, remaining_amount, description } = req.body
  const sale = await Sale.create({
    date,
    amount,
    paid_amount,
    remaining_amount,
    description,
  })
  res.status(201).json(sale)
})

const getSales = catchAsync(async (req, res, next) => {
  const sales = await Sale.findAll()
  res.status(200).json(sales)
})

const getSaleById = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const sale = await Sale.findByPk(id)
  if (!sale) {
    return next(new AppError('sale not found !', 404))
  }
  res.status(200).json(sale)
})

const updateSale = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { date, amount, paid_amount, remaining_amount, description } = req.body
  const sale = await Sale.findByPk(id)
  if (sale) {
    await sale.update({
      date,
      amount,
      paid_amount,
      remaining_amount,
      description,
    })
    res.status(200).json(sale)
  } else {
    return next(new AppError('sale to update not found'))
  }
})

const deleteSale = catchAsync(async (req, res, next) => {
  const { id } = req.params
  // Find all product-sales for the saleId
  const productSales = await ProductSale.findAll({ where: { saleId: id } })

  if (productSales.length === 0) {
    return next(new AppError('no product found for this sale', 404))
  }

  // Loop through each product-sale and update the corresponding product's quantity
  for (const productSale of productSales) {
    const product = await Product.findByPk(productSale.productId)

    if (product) {
      // Increase the product quantity by the quantity from the sale
      product.quantity += productSale.quantity
      await product.save()
    }
  }

  // Delete the product-sales associated with the sale
  await ProductSale.destroy({ where: { saleId: id } })

  // Find and delete the sale itself
  const sale = await Sale.findByPk(id)
  if (sale) {
    await sale.destroy()
    res.status(204).send()
  } else {
    return next(new AppError('sale to delete not found !', 404))
  }
})

const deleteAllSales = catchAsync(async (req, res, next) => {
  await Sale.destroy({ where: {}, truncate: true })

  // Reset the auto-increment sequence (for SQLite)
  await Sale.sequelize.query("DELETE FROM sqlite_sequence WHERE name='Sales';")
  await ProductSale.destroy({ where: {}, truncate: true })

  // Reset the auto-increment sequence (for SQLite)
  await ProductSale.sequelize.query(
    "DELETE FROM sqlite_sequence WHERE name='ProductSales';",
  )
  res.status(200).json({ message: 'All Sales  deleted successfully' })
})

module.exports = {
  getSalesCountByDate,
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
  getSumOfPaidAmounts,
  getTotalrevenue,
  getSumRemainingAmount,
  getTotalIncomeByDate,
  getTopUnbalancedProductsByDate,
  getTopProfitableUnbalancedProductsByDate,
  deleteAllSales,
}
