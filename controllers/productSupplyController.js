const {Product,ProductSupply } = require('../models');
const { Op } = require('sequelize'); // Import Op from Sequelize


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
  } catch (error) {
    console.error('Error updating or inserting product supply:', error);
    res.status(500).json({ error: 'Failed to update or insert product supply' });
  }
};





const deleteProductSupply = async (req, res) => {
  try {
    const { id } = req.params;
    const productSupply = await ProductSupply.findByPk(id);

    if (productSupply) {
      // Find the associated product in the Products table
      const product = await Product.findByPk(productSupply.productId);

      if (product) {
        // Decrease the product quantity by the amount in the deleted ProductSupply
        product.quantity -= productSupply.quantity;
        await product.save(); // Save the updated product
      }

      // Delete the ProductSupply
      await productSupply.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Product supply not found' });
    }
  } catch (error) {
    console.error('Error deleting product supply:', error);
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
