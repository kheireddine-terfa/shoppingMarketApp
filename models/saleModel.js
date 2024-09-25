module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define(
    'Sale',
    {
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
        validate: {
          min: {
            args: [0],
            msg: 'Amount must be greater than or equal to 0',
          },
        },
      },
      paid_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: 'Paid amount must be greater than or equal to 0',
          },
        },
      },
      remaining_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: 'Remaining amount must be greater than or equal to 0',
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      // Add a custom validator
      validate: {
        checkAmountSum() {
          if (
            Number(this.paid_amount) + Number(this.remaining_amount) !==
            Number(this.amount)
          ) {
            throw new Error(
              'Paid amount and remaining amount must exactly equal the total amount.',
            )
          }
        },
      },
    },
  )

  return Sale
}
