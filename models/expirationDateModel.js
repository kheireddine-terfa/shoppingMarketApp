module.exports = (sequelize, DataTypes) => {
    const ExpirationDate = sequelize.define('ExpirationDate', {
      date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      alert_interval: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    });
  
    return ExpirationDate;
  };
  