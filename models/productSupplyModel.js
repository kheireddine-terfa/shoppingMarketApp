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

  
  

  return ProductSupply;
};
