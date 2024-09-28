module.exports = (sequelize, DataTypes) => {
  const RolePage = sequelize.define('RolePage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    actions: {
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
    role_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Role',
        key: 'id',
      },
    },
    page_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Page',
        key: 'id',
      },
    },
  })

  return RolePage
}
