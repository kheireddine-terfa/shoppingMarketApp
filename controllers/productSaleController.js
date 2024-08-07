const { ProductSale } = require('../models');

const createProductSale = async (req, res) => {
  try {
    const { quantity } = req.body;
    const productSale = await ProductSale.create({ quantity });
    res.status(201).json(productSale);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product sale' });
  }
};

const getProductSales = async (req, res) => {
  try {
    const productSales = await ProductSale.findAll();
    res.status(200).json(productSales);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product sales' });
  }
};

const getProductSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const productSale = await ProductSale.findByPk(id);
    if (productSale) {
      res.status(200).json(productSale);
    } else {
      res.status(404).json({ error: 'Product sale not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product sale' });
  }
};

const updateProductSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const productSale = await ProductSale.findByPk(id);
    if (productSale) {
      await productSale.update({ quantity });
      res.status(200).json(productSale);
    } else {
      res.status(404).json({ error: 'Product sale not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product sale' });
  }
};

const deleteProductSale = async (req, res) => {
  try {
    const { id } = req.params;
    const productSale = await ProductSale.findByPk(id);
    if (productSale) {
      await productSale.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Product sale not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product sale' });
  }
};

module.exports = {
  createProductSale,
  getProductSales,
  getProductSaleById,
  updateProductSale,
  deleteProductSale,
};
