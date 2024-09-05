module.exports = (sequelize, DataTypes) => {
    const ProductSale = sequelize.define('ProductSupply', {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      purchase_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    });
  
    return ProductSale;
  };