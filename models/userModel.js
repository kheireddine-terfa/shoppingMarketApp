const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: 'Username cannot be empty',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Password cannot be empty',
          },
        },
      },
      passwordConfirm: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Password confirm cannot be empty',
          },
        },
      },
    },
    {
      // Hooks
      hooks: {
        // Before saving (both creating and updating)
        beforeSave: async (user) => {
          if (user.changed('password')) {
            // Check if password was modified
            const hashedPassword = await bcrypt.hash(user.password, 12)
            user.password = hashedPassword // Hash the password and set it
            // Delete passwordConfirm field after hashing
            delete user.passwordConfirm
          }
        },
      },
      // Add a custom validator
      validate: {
        checkPasswordConfirm() {
          if (this.password !== this.passwordConfirm) {
            throw new Error(
              'password confirm must be the same as the password ',
            )
          }
        },
      },
    },
  )
  // Define associations
  User.associate = (models) => {
    // User belongs to a role
    User.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' })
  }

  return User
}
