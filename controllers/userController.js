const { User } = require('../models')
const catchAsync = require('../utils/catchAsync')
exports.deleteAllUsers = catchAsync(async (req, res, next) => {
  await User.destroy({ where: {}, truncate: true })
  await User.sequelize.query("DELETE FROM sqlite_sequence WHERE name='Users';")
  res.status(200).json({ message: 'All users deleted successfully' })
})
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ['password', 'passwordConfirm'] },
  })
  res.status(200).json({
    status: 'success',
    users,
  })
})
