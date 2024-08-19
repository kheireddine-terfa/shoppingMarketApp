module.exports = (sequelize, DataTypes) => {
  const ProductSale = sequelize.define('ProductSale', {
    quantity: {
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
    saleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Sales',
        key: 'id',
      },
    },
  });

  ProductSale.afterCreate(async (productSale) => {
    try {
      // Decrease the product quantity
      const product = await sequelize.models.Product.findByPk(productSale.productId);
      if (product) {
        await product.update({ quantity: product.quantity - productSale.quantity });
      }
    } catch (error) {
      console.error('Error updating product quantity after create:', error);
    }
  });

  ProductSale.afterDestroy(async (productSale) => {
    try {
      // Increase the product quantity
      const product = await sequelize.models.Product.findByPk(productSale.productId);
      if (product) {
        await product.update({ quantity: product.quantity + productSale.quantity });
      }
    } catch (error) {
      console.error('Error updating product quantity after delete:', error);
    }
  });

  return ProductSale;
};
