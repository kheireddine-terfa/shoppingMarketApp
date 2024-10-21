module.exports = (sequelize, DataTypes) => {
  const ProductSupply = sequelize.define('ProductSupply', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    purchase_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id',
      },
    },
    supplyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Supplies',
        key: 'id',
      },
    },
  });

  // Hook to update the product quantity after creating a ProductSupply entry
  ProductSupply.afterCreate(async (productSupply) => {
    try {
      const product = await sequelize.models.Product.findByPk(productSupply.productId);
      if (product) {
        await product.update({ quantity: product.quantity + productSupply.quantity });
      }
    } catch (error) {
      console.error('Error updating product quantity after create:', error);
    }
  });

  // Hook to update the product quantity after destroying a ProductSupply entry
  ProductSupply.afterDestroy(async (productSupply) => {
    try {
      const product = await sequelize.models.Product.findByPk(productSupply.productId);
      if (product) {
        await product.update({ quantity: product.quantity - productSupply.quantity });
      } else {
        console.log('Product not found for ProductSupply:', productSupply.productId);
      }
    } catch (error) {
      console.error('Error updating product quantity after delete:', error);
    }
  });
  

  ProductSupply.afterUpdate(async (productSupply, options) => {
    const previousQuantity = productSupply._previousDataValues.quantity;
    const newQuantity = productSupply.quantity;
    const previousProductId = productSupply._previousDataValues.productId;
    const newProductId = productSupply.productId;
  
    // Check if the quantity has changed
    if (newQuantity !== previousQuantity) {
      const quantityDifference = newQuantity - previousQuantity;
      
      // Update the new product's quantity
      await sequelize.models.Product.increment(
        { quantity: quantityDifference },
        { where: { id: newProductId }, transaction: options.transaction }
      );
    }
  
    // Check if the productId has changed
    if (newProductId !== previousProductId) {
      // Decrease the quantity of the old product
      await sequelize.models.Product.increment(
        { quantity: -previousQuantity }, // Subtract the previous quantity from the old product
        { where: { id: previousProductId }, transaction: options.transaction }
      );
  
      // Add the quantity to the new product
      await sequelize.models.Product.increment(
        { quantity: newQuantity }, // Add the new quantity to the new product
        { where: { id: newProductId }, transaction: options.transaction }
      );
    }
  });
  
  

  return ProductSupply;
};
