module.exports = (sequelize, DataTypes) => {
    const ProductSupply = sequelize.define('ProductSupply', {
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


    ProductSupply.afterCreate(async (productSupply) => {
      try {
        // increase the product quantity
        const product = await sequelize.models.Product.findByPk(productSupply.productId);
        if (product) {
          await product.update({ quantity: product.quantity + productSupply.quantity });
        }
      } catch (error) {
        console.error('Error updating product quantity after create:', error);
      }
    });

    ProductSupply.afterDestroy(async (productSupply) => {
      try {
        // decrease the product quantity
        const product = await sequelize.models.Product.findByPk(productSupply.productId);
        if (product) {
          await product.update({ quantity: product.quantity - productSupply.quantity });
        }
      } catch (error) {
        console.error('Error updating product quantity after delete:', error);
      }
    });
   
    return ProductSupply;
  };