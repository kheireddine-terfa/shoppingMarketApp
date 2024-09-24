module.exports = (sequelize, DataTypes) => {
    const Supplier = sequelize.define('Supplier', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Supplier name is required.',
          },
          notEmpty: {
            msg: 'Supplier name cannot be empty.',
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Supplier address is required.',
          },
          notEmpty: {
            msg: 'Supplier address cannot be empty.',
          },
        },

      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Supplier phone number is required.',
          },
          notEmpty: {
            msg: 'Supplier phone number cannot be empty.',
          },
          is: {
            args: /^(05|06|07)[0-9]{8}$/, // Regex to allow only numbers starting with 05, 06, or 07, and exactly 10 digits
            msg: 'Phone number must start with 05, 06, or 07 and be exactly 10 digits long.',
          },
        },

      },
    });
  
    return Supplier;
  };
  