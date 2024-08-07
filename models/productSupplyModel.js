module.exports = (sequelize, DataTypes) => {
    const ProductSale = sequelize.define('ProductSupply', {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    return ProductSale;
  };