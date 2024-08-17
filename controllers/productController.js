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

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, bare_code, quantity, min_quantity } = req.body;
    const product = await Product.findByPk(id);
    if (product) {
      await product.update({ name, price, bare_code, quantity, min_quantity });
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (product) {
      await product.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

const getProductsWithoutBarcode = async (req, res) => {
  try {
    const productsWithoutBarcode = await Product.findAll({
      where: {
        hasBarCode: false,
      },
    });
    res.status(200).json(productsWithoutBarcode);
  } catch (error) {
    console.error('Error fetching products without barcode:', error); // Log the error details
    res.status(500).json({ error: 'Failed to fetch products without barcode' });
  }
};

const getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;
    // Fetch the product by barcode
    const product = await Product.findOne({ where: { bare_code: barcode } });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by barcode:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsWithoutBarcode,
  getProductByBarcode
};
