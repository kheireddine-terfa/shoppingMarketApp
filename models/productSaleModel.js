module.exports = (sequelize, DataTypes) => {
    const ProductSale = sequelize.define('ProductSale', {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    return ProductSale;
  };
  