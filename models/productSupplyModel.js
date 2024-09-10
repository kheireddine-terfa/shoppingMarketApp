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
  
    return ProductSupply;
  };