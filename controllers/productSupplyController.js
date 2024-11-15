const { Product, ProductSupply, ExpirationDate } = require('../models');
const { Op } = require('sequelize');
const catchAsync = require('../utils/catchAsync');
const { sequelize } = require('../models'); // Assuming sequelize instance is exported from models/index.js

// Helper function for quantity adjustment
async function adjustProductQuantity(productId, quantityChange) {
  const product = await Product.findByPk(productId);
  if (!product) throw new Error(`Product with ID ${productId} not found`);
  
  product.quantity += quantityChange;
  await product.save();
}

// Create ProductSupply entry and associated ExpirationDate
const createProductSupply = catchAsync(async (req, res, next) => {
  const { quantity, purchase_price, productId, supplyId, expiration_date, alert_interval } = req.body;

  try {
    const result = await sequelize.transaction(async (transaction) => {
      const productSupply = await ProductSupply.create(
        { quantity, purchase_price, productId, supplyId },
        { transaction }
      );
      const expirationDate = await ExpirationDate.create(
        { date: expiration_date, alert_interval, productId, supplyId },
        { transaction }
      );
      return { productSupply, expirationDate };
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product supply and expiration date', details: error.message });
  }
});

// Get all ProductSupplies
const getProductSupplies = catchAsync(async (req, res, next) => {
  try {
    const productSupplies = await ProductSupply.findAll();
    res.status(200).json(productSupplies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve product supplies', details: error.message });
  }
});

// Get a ProductSupply by ID
const getProductSupplyById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  try {
    const productSupply = await ProductSupply.findByPk(id);
    if (!productSupply) {
      return res.status(404).json({ error: 'Product supply not found' });
    }
    res.status(200).json(productSupply);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve product supply', details: error.message });
  }
});

const updateProductSupply = catchAsync(async (req, res) => {
  console.log('Request Body:', req.body); // Expecting an array of products

  // Get all the products from the request body
  const products = req.body;

  // Loop through each product and update or create the ProductSupply
  const promises = products.map(async (usp) => {
    const { newProductId, productId, supplyId, quantity, purchase_price } = usp;

    // Find the existing ProductSupply
    let productSupply = await ProductSupply.findOne({
      where: {
        productId,
        supplyId,
      },
    });

    // If not found, create a new ProductSupply
    if (!productSupply) {
      productSupply = await ProductSupply.create({
        productId: newProductId || productId, // Use newProductId if provided, otherwise keep the original
        supplyId,
        quantity,
        purchase_price,
      });
      return productSupply; // Return the newly created product supply
    }

    // If found, update the existing ProductSupply
    const oldQuantity = productSupply.quantity; // Store the original quantity
    const oldProductId = productSupply.productId; // Store the original productId

    productSupply.quantity = quantity !== undefined ? quantity : productSupply.quantity;
    productSupply.purchase_price = purchase_price !== undefined ? purchase_price : productSupply.purchase_price;
    productSupply.productId = newProductId || productId;

    // Handle quantity adjustment for changed productId
    if (newProductId && oldProductId !== newProductId) {
      // Decrease the quantity of the old product
      const oldProduct = await Product.findByPk(oldProductId);
      if (oldProduct) {
        oldProduct.quantity -= oldQuantity;
        await oldProduct.save();
      }

      // Increase the quantity of the new product
      const newProduct = await Product.findByPk(newProductId);
      if (newProduct) {
        newProduct.quantity += quantity;
        await newProduct.save();
      }
    } else if (quantity !== undefined) {
      // If the quantity is updated but the productId hasn't changed, adjust the quantity of the same product
      const product = await Product.findByPk(oldProductId);
      if (product) {
        product.quantity += quantity - oldQuantity; // Update the product quantity accordingly
        await product.save();
      }
    }

    // Save the updated ProductSupply
    await productSupply.save();
    return productSupply; // Return the updated product supply
  });

  // Wait for all promises to complete
  const updatedSupplies = await Promise.all(promises);

  // Collect all received productIds for deletion check
  const receivedProductIds = products.map((usp) => usp.newProductId || usp.productId);

  // Find the ProductSupply records that will be deleted
  const suppliesToDelete = await ProductSupply.findAll({
    where: {
      supplyId: products[0].supplyId, // Use the supplyId from the first product in the list
      productId: {
        [Op.not]: receivedProductIds, // Delete where productId is not in the received list
      },
    },
  });

  // Decrease the quantity of the products in the Product table for the supplies that are about to be deleted
  const decreaseQuantityPromises = suppliesToDelete.map(async (supply) => {
    const product = await Product.findByPk(supply.productId);
    if (product) {
      // Subtract the supply quantity from the product quantity
      product.quantity -= supply.quantity;
      await product.save();
    }
  });

  // Wait for all quantity updates to complete
  await Promise.all(decreaseQuantityPromises);

  // Finally, delete the ProductSupply records
  await ProductSupply.destroy({
    where: {
      supplyId: products[0].supplyId, // Use the supplyId from the first product in the list
      productId: {
        [Op.not]: receivedProductIds, // Delete where productId is not in the received list
      },
    },
  });

  // Respond with the updated products
  res.status(200).json({ message: 'Products updated successfully', updatedSupplies });
})


// Delete a ProductSupply and update associated product quantity
const deleteProductSupply = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  try {
    const productSupply = await ProductSupply.findByPk(id);

    if (!productSupply) {
      return res.status(404).json({ error: 'Product supply not found' });
    }

    await sequelize.transaction(async (transaction) => {
      await adjustProductQuantity(productSupply.productId, -productSupply.quantity); // Adjust the quantity
      await productSupply.destroy({ transaction }); // Delete the ProductSupply
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product supply', details: error.message });
  }
});

module.exports = {
  createProductSupply,
  getProductSupplies,
  getProductSupplyById,
  updateProductSupply,
  deleteProductSupply,
};
