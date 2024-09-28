module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Role name cannot be empty',
        },
      },
    },
  })

  Role.associate = (models) => {
    // Role has many-to-many relation with Page through RolePage
    Role.belongsToMany(models.Page, {
      through: models.RolePage,
      foreignKey: 'role_id',
      as: 'pages',
    })
  }

  return Role
}
