module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define('Expense', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'the description is required.',
        },
        notEmpty: {
          msg: 'description cannot be empty.',
        },
      },
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'amount is required.',
        },
        isFloat: {
          msg: 'amount must be a valid number.',
        },
        min: {
          args: [0],
          msg: 'amount must be greater than or equal to 0.',
        },
      },
    },
  })

  return Expense
}
