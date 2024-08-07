module.exports = (sequelize, DataTypes) => {
    const ExpirationDate = sequelize.define('ExpirationDate', {
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      alert_interval: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    return ExpirationDate;
  };
  