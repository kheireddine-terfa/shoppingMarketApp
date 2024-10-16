const { Supply,Supplier } = require('../models')
const { sequelize } = require('../models'); // Use require instead of import


const createSupply = async (req, res) => {
  try {
    const {
      date,
      amount,
      description,
      paid_amount,
      remaining_amount,
      supplierId
    } = req.body
    const supply = await Supply.create({
      date,
      amount,
      description,
      paid_amount,
      remaining_amount,
      supplierId
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

async function getSuppliedProductsBySupplyId(req, res) {
  const { supplyId } = req.params; // Assuming supplyId is passed as a URL parameter
  try {
    const result = await sequelize.query(
      `SELECT 
          ProductSupplies.quantity, 
          ProductSupplies.purchase_price,
          Products.name 
       FROM 
          ProductSupplies
       JOIN 
          Products ON Products.id = ProductSupplies.productId
       WHERE 
          ProductSupplies.supplyId = :supplyId`, // Use a named parameter for supplyId
      {
        replacements: { supplyId }, // Replace supplyId in the query
        type: sequelize.QueryTypes.SELECT
      }
    );

    // Send the result as a JSON response
    res.json(result);
  } catch (error) {
    console.error('Error fetching products by supply ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the products.' });
  }
}

const getSupplierBySupplyId = async (req, res) => {
  const { supplyId } = req.params;

  try {
    // Find the supply by ID and include the associated supplier
    const supply = await Supply.findByPk(supplyId, {
      include: Supplier, // No alias needed if you're not using one
    });

    if (!supply) {
      return res.status(404).json({ message: 'Supply not found' });
    }

    // Send the associated supplier as a response
    return res.json(supply.Supplier); // Sequelize uses the model name by default
  } catch (error) {
    console.error('Error fetching supplier:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = {
  createSupply,
  getSupplies,
  getSupplyById,
  updateSupply,
  deleteSupply,
  deleteAllSupplies,
  getSupplierBySupplyId,
  getSuppliedProductsBySupplyId,
  
}
