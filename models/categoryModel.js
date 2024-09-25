module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
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
          msg: 'Category name is required.',
        },
        notEmpty: {
          msg: 'Category name cannot be empty.',
        },
      },
    },
    image: {
      type: DataTypes.STRING,
    },
  })

  return Category
}
