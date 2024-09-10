const { ProductSupply } = require('../models');

const createProductSupply = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    const { quantity,purchase_price , productId, supplyId} = req.body;
    const productSupply = await ProductSupply.create({ quantity, purchase_price, productId, supplyId });
    res.status(201).json(productSupply);
  } catch (error) {
    console.error('Error creating product supply:', error);
    res.status(500).json({ error: 'Failed to create product supply' });
  }
};


const getProductSupplies = async (req, res) => {
  try {
    const productSupplies = await ProductSupply.findAll();
    res.status(200).json(productSupplies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product supplies' });
  }
};

const getProductSupplyById = async (req, res) => {
  try {
    const { id } = req.params;
    const productSupply = await ProductSupply.findByPk(id);
    if (productSupply) {
      res.status(200).json(productSupply);
    } else {
      res.status(404).json({ error: 'Product supply not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product supply' });
  }
};

const updateProductSupply = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const productSupply = await ProductSupply.findByPk(id);
    if (productSupply) {
      await productSupply.update({ quantity });
      res.status(200).json(productSupply);
    } else {
      res.status(404).json({ error: 'Product supply not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product supply' });
  }
};

const deleteProductSupply = async (req, res) => {
  try {
    const { id } = req.params;
    const productSupply = await ProductSupply.findByPk(id);
    if (productSupply) {
      await productSupply.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Product supply not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product supply' });
  }
};

module.exports = {
  createProductSupply,
  getProductSupplies,
  getProductSupplyById,
  updateProductSupply,
  deleteProductSupply,
};
