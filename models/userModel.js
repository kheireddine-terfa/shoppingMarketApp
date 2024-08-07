const bcrypt = require('bcrypt')
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passWord: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })
  // Hash password before saving
  User.beforeSave(async (user, options) => {
    if (user.changed('passWord')) {
      const hashedPassword = await bcrypt.hash(user.passWord, 12)
      user.passWord = hashedPassword
    }
  })
  return User
}
