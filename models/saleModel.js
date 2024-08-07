module.exports = (sequelize, DataTypes) => {
    const Sale = sequelize.define('Sale', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },      
      paid_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      remaining_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    });
  
    return Sale;
  };
  