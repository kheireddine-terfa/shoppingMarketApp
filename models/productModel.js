module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
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
          msg: 'Product name is required.',
        },
        notEmpty: {
          msg: 'Product name cannot be empty.',
        },
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Price is required.',
        },
        isFloat: {
          msg: 'Price must be a valid number.',
        },
        min: {
          args: [0],
          msg: 'Price must be greater than or equal to 0.',
        },
      },
    },
    purchase_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Purchase price is required.',
        },
        isFloat: {
          msg: 'Purchase price must be a valid number.',
        },
        min: {
          args: [0],
          msg: 'Purchase price must be greater than or equal to 0.',
        },
      },
    },
    bare_code: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        len: {
          args: [8, 20],
          msg: 'Barcode must be between 8 and 20 characters long.',
        },
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Quantity is required.',
        },
        isInt: {
          msg: 'Quantity must be an integer.',
        },
        min: {
          args: [0],
          msg: 'Quantity must be greater than or equal to 0.',
        },
      },
    },
    min_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Minimum quantity is required.',
        },
        isInt: {
          msg: 'Minimum quantity must be an integer.',
        },
        min: {
          args: [0],
          msg: 'Minimum quantity must be greater than or equal to 0.',
        },
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hasBarCode: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    balanced_product: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  })

  return Product
}
