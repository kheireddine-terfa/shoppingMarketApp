const { Product } = require('../models');

const createProduct = async (req, res) => {
  try {
    const { name, price, bare_code, quantity, min_quantity } = req.body;
    const product = await Product.create({ name, price, bare_code, quantity, min_quantity });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

module.exports = {
  createProduct,
  getProducts,
};
