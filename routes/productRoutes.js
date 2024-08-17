const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsWithoutBarcode,
  getProductByBarcode
} = require('../controllers/productController');

const router = express.Router();

// Create a new product
router.post('/', createProduct);

// Get all products
router.get('/', getProducts);

// Get products without barcode
router.get('/no-barcode', getProductsWithoutBarcode);

// Get a product by barcode (place this before the ID route)
router.get('/barcode/:barcode', getProductByBarcode);

// Get a single product by ID
router.get('/:id', getProductById);

// Update a product by ID
router.put('/:id', updateProduct);

// Delete a product by ID
router.delete('/:id', deleteProduct);

module.exports = router;
