const { ProductSale } = require('../models');

// Utility function to find a ProductSale by ID
const findProductSaleById = async (id) => {
  const productSale = await ProductSale.findByPk(id);
  if (!productSale) {
    throw new Error('Product sale not found');
  }
  return productSale;
};

// Create a new ProductSale with productId and saleId
const createProductSale = async (req, res) => {
  try {
    const { quantity, productId, saleId } = req.body;

    if (!quantity || !productId || !saleId) {
      return res.status(400).json({ error: 'Quantity, productId, and saleId are required' });
    }

    const productSale = await ProductSale.create({ quantity, productId, saleId });
    res.status(201).json(productSale);
  } catch (error) {
    res.status(500).json({ error: `Failed to create product sale: ${error.message}` });
  }
};

// Retrieve all ProductSales, possibly including associated data
const getProductSales = async (req, res) => {
  try {
    const productSales = await ProductSale.findAll({
      // Optionally include associated models
      // include: [{ model: Product }, { model: Sale }],
    });
    res.status(200).json(productSales);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch product sales: ${error.message}` });
  }
};

// Retrieve a specific ProductSale by ID
const getProductSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const productSale = await findProductSaleById(id);
    res.status(200).json(productSale);
  } catch (error) {
    res.status(404).json({ error: `Failed to fetch product sale: ${error.message}` });
  }
};

// Update a ProductSale's quantity by ID
const updateProductSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
      return res.status(400).json({ error: 'Quantity is required' });
    }

    const productSale = await findProductSaleById(id);
    await productSale.update({ quantity });
    res.status(200).json(productSale);
  } catch (error) {
    res.status(500).json({ error: `Failed to update product sale: ${error.message}` });
  }
};

// Delete a ProductSale by ID
const deleteProductSale = async (req, res) => {
  try {
    const { id } = req.params;
    const productSale = await findProductSaleById(id);
    await productSale.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: `Failed to delete product sale: ${error.message}` });
  }
};

module.exports = {
  createProductSale,
  getProductSales,
  getProductSaleById,
  updateProductSale,
  deleteProductSale,
};
