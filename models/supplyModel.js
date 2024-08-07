module.exports = (sequelize, DataTypes) => {
    const Supply = sequelize.define('Supply', {
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
      description: {
        type: DataTypes.STRING,
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
  
    return Supply;
  };
  