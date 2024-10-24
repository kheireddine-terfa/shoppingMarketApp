const { User, Role } = require('../models')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const { Op } = require('sequelize')
exports.deleteAllUsers = catchAsync(async (req, res, next) => {
  // Find the role ID for 'admin'
  const adminRole = await Role.findOne({ where: { name: 'admin' } })

  if (!adminRole) {
    return res.status(404).json({ message: 'Admin role not found' })
  }

  // Delete all users except those with the 'admin' role
  await User.destroy({
    where: {
      role_id: { [Op.ne]: adminRole.id }, // Exclude users with admin role
    },
  })

  // Reset the auto-increment in the Users table (if needed, for databases like SQLite)
  await User.sequelize.query("DELETE FROM sqlite_sequence WHERE name='Users';")

  res
    .status(200)
    .json({ message: 'All users except admins deleted successfully' })
})

exports.deleteUser = catchAsync(async (req, res, next) => {
  const id = req.params.id
  await User.destroy({ where: { id } })
  res.status(204).json({
    status: 'success',
    message: 'user deleted successfully',
  })
})
exports.updateUser = catchAsync(async (req, res, next) => {
  const id = req.params.id
  const { username, role_id } = req.body
  const user = await User.findByPk(id)
  if (!user) {
    return next(new AppError('user to update not found !', 404))
  }
  if (username) {
    user.username = username
  }
  if (role_id) {
    user.role_id = role_id
  }
  await user.save()
  res.status(200).json({
    status: 'success',
    message: 'user updated successfully',
  })
})
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ['password', 'passwordConfirm'] },
    include: {
      model: Role,
      as: 'role',
      attributes: ['name'],
    },
  })
  res.status(200).json({
    status: 'success',
    users,
  })
})
