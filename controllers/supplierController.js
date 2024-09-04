const { Supplier } = require('../models')

const createSupplier = async (req, res) => {
  try {
    console.log('💥✨💥✨😂💥✨😂')
    console.log(req.body)
    const { name, address, phone_number } = req.body
    const supplier = await Supplier.create({ name, address, phone_number })
    res.status(201).json(supplier)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create supplier' })
  }
}

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll()
    res.status(200).json(suppliers)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suppliers' })
  }
}

const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params
    const supplier = await Supplier.findByPk(id)
    if (supplier) {
      res.status(200).json(supplier)
    } else {
      res.status(404).json({ error: 'Supplier not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch supplier' })
  }
}

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params
    const { name, address, phone_number } = req.body
    const supplier = await Supplier.findByPk(id)
    if (supplier) {
      await supplier.update({ name, address, phone_number })
      res.status(200).json(supplier)
    } else {
      res.status(404).json({ error: 'Supplier not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update supplier' })
  }
}

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params
    const supplier = await Supplier.findByPk(id)
    if (supplier) {
      await supplier.destroy()
      res.status(204).send()
    } else {
      res.status(404).json({ error: 'Supplier not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete supplier' })
  }
}
const deleteAllSuppliers = async(req,res)=>{
  try {
    // Delete all suppliers from the database
    await Supplier.destroy({ where: {}, truncate: true })

    // Reset the auto-increment sequence (for SQLite)
    await Supplier.sequelize.query(
      "DELETE FROM sqlite_sequence WHERE name='Suppliers';",
    )

    res
      .status(200)
      .json({ message: 'All Suppliers  deleted successfully' })
  } catch (error) {
    console.error('Error deleting Suppliers:', error)
    res.status(500).json({ error: error.message })
  }
}
module.exports = {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  deleteAllSuppliers
}
