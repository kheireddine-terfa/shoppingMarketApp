module.exports = (sequelize, DataTypes) => {
  const Page = sequelize.define('Page', {
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
          msg: 'Page name cannot be empty',
        },
      },
    },
    available_actions: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'actions field cannot be empty',
        },
        isValidActions(value) {
          const validAcions = ['view', 'delete', 'add', 'update']
          const actionsArray = value.split(',')

          actionsArray.forEach((actions) => {
            if (!validAcions.includes(actions.trim())) {
              throw new Error(`Invalid actions: ${actions}`)
            }
          })
        },
      },
    },
  })

  Page.associate = (models) => {
    // Page has many-to-many relation with Role through RolePage
    Page.belongsToMany(models.Role, {
      through: models.RolePage,
      foreignKey: 'page_id',
      as: 'roles',
    })
  }

  return Page
}
