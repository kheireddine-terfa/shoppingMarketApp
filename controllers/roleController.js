const { Role, RolePage, Page } = require('../models')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const createRole = catchAsync(async (req, res, next) => {
  const { name, permissions } = req.body

  // Create the role
  const role = await Role.create({ name })

  // If no permissions were provided, throw an error
  if (!permissions || permissions.length === 0) {
    return next(new AppError('No permissions provided', 400))
  }

  let rolePages = []

  // Iterate over the permissions array
  for (const permission of permissions) {
    const { page, actions } = permission

    // Find the page by name
    const foundPage = await Page.findOne({ where: { name: page } })
    if (!foundPage) {
      return next(new AppError(`Page ${page} not found`, 404))
    }

    // Create the RolePage entry with the role, page, and actions
    const rolePage = await RolePage.create({
      role_id: role.id,
      page_id: foundPage.id,
      actions, // This will store the actions as a string (e.g., 'update,view,add')
    })

    rolePages.push(rolePage)
  }

  // Send response
  res.status(201).json({
    status: 'success',
    role,
    rolePages,
  })
})

const deleteRole = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const role = Role.findByPk(id)
  if (!role) {
    return next(new AppError('Role to delete not found!', 404))
  }
  await role.destroy()
  res.status(204).json({
    status: 'success',
    message: 'Role deleted successfully',
  })
})
const updateRole = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const role = await Role.findByPk(id)
  if (!role) {
    return next(new AppError('Role to update not found!', 404))
  }
  role.name = req.body.name
  const updatedRole = await Role.save()
  res.status(200).json({
    status: 'success',
    updatedRole,
  })
})
const getRoles = catchAsync(async (req, res, next) => {
  const roles = await Role.findAll()
  const rolePages = await RolePage.findAll()
  res.status(200).json({
    status: 'success',
    roles,
    rolePages,
  })
})
const deleteAllRoles = catchAsync(async (req, res, next) => {
  await Role.destroy({ where: {}, truncate: true })
  // Reset the auto-increment sequence (for SQLite)
  await Role.sequelize.query("DELETE FROM sqlite_sequence WHERE name='Roles';")
  await RolePage.sequelize.query(
    "DELETE FROM sqlite_sequence WHERE name='RolePages';",
  )

  res.status(204).json({
    status: 'success',
    message: 'all Roles deleted successfully',
  })
})
module.exports = {
  createRole,
  deleteRole,
  updateRole,
  getRoles,
  deleteAllRoles,
}
