const { Supply } = require('../models')

const createSupply = async (req, res) => {
  try {
    const {
      date,
      amount,
      description,
      paid_amount,
      remaining_amount,
    } = req.body
    const supply = await Supply.create({
      date,
      amount,
      description,
      paid_amount,
      remaining_amount,
    })
    res.status(201).json(supply)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create supply' })
  }
}

const getSupplies = async (req, res) => {
  try {
    console.log('here')
    const supplies = await Supply.findAll({
      attributes: { exclude: ['supplierId'] },
    })
    res.status(200).json(supplies)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch supplies' })
  }
}

const getSupplyById = async (req, res) => {
  try {
    const { id } = req.params
    const supply = await Supply.findByPk(id)
    if (supply) {
      res.status(200).json(supply)
    } else {
      res.status(404).json({ error: 'Supply not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch supply' })
  }
}

const updateSupply = async (req, res) => {
  try {
    const { id } = req.params
    const {
      date,
      amount,
      description,
      paid_amount,
      remaining_amount,
    } = req.body
    const supply = await Supply.findByPk(id)
    if (supply) {
      await supply.update({
        date,
        amount,
        description,
        paid_amount,
        remaining_amount,
      })
      res.status(200).json(supply)
    } else {
      res.status(404).json({ error: 'Supply not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update supply' })
  }
}

const deleteSupply = async (req, res) => {
  try {
    const { id } = req.params
    const supply = await Supply.findByPk(id)
    if (supply) {
      supply.supplierId = null
      await supply.save()
      await supply.destroy()
      res.status(204).send()
    } else {
      res.status(404).json({ error: 'Supply not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete supply' })
  }
}
const deleteAllSupplies = async (res, req) => {
  try {
    // Delete all supplies from the database
    await Supply.destroy({ where: {}, truncate: true })

    // Reset the auto-increment sequence (for SQLite)
    await Supply.sequelize.query(
      "DELETE FROM sqlite_sequence WHERE name='Supplies';",
    )

    res.status(200).json({ message: 'All Supplies  deleted successfully' })
  } catch (error) {
    console.error('Error deleting Supplies:', error)
    res.status(500).json({ error: error.message })
  }
}
module.exports = {
  createSupply,
  getSupplies,
  getSupplyById,
  updateSupply,
  deleteSupply,
  deleteAllSupplies,
}
