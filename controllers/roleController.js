const { Role, RolePage, Page, User } = require('../models')
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
  await Role.destroy({ where: { id } })
  res.status(204).json({
    status: 'success',
    message: 'Role deleted successfully',
  })
})
const updateRole = catchAsync(async (req, res, next) => {
  const { id } = req.params // Get role ID from request parameters
  const { name, pages } = req.body // Get name and pages from request body

  // Check if the role exists
  const role = await Role.findByPk(id)
  if (!role) {
    return next(new AppError('role not found !', 404))
  }

  // Update role name
  role.name = name
  await role.save()

  // Update permissions for the role
  // Clear existing RolePage associations
  await RolePage.destroy({ where: { role_id: id } })

  // Re-establish page permissions
  const promises = pages.map(async (page) => {
    const pageRecord = await Page.findOne({ where: { name: page.page } }) // Find the page by name
    if (pageRecord) {
      // Create or update the RolePage entry
      await RolePage.create({
        role_id: role.id,
        page_id: pageRecord.id,
        actions: page.actions,
      })
    }
  })

  await Promise.all(promises) // Wait for all permissions to be updated

  return res.status(200).json({ message: 'Role updated successfully' })
})
const getRoles = catchAsync(async (req, res, next) => {
  const roles = await Role.findAll({
    include: [
      {
        model: Page,
        as: 'pages',
        through: {
          attributes: ['actions'], // Include the actions from RolePage
        },
      },
    ],
  })
  const rolesPage = await RolePage.findAll()
  const roleLenght = rolesPage.length
  // Format the result as needed
  const formattedRoles = roles.map((role) => ({
    roleLenght,
    roleId: role.id,
    roleName: role.name, // Assuming 'name' is the field for the role's name
    pages: role.pages.map((page) => ({
      page: page.name, // Assuming 'name' is the field for the page's name
      actions: page.RolePage.actions, // Access 'actions' from RolePage
    })),
  }))

  res.status(200).json(formattedRoles)
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
const getUsersAndRoles = catchAsync(async (req, res, next) => {
  const users = await User.findAll({ where: { role_id: null } })
  const roles = await Role.findAll()
  res.status(200).json({
    status: 'success',
    users,
    roles,
  })
})
const assignRoleToUser = catchAsync(async (req, res, next) => {
  const { roleId, userId } = req.body
  const user = await User.findByPk(userId)
  const role = await Role.findByPk(roleId)
  //1 check if the user exists :
  if (!user) {
    return next(new AppError('no user found with this ID ', 404))
  }
  //2 check if the role exists:
  if (!role) {
    return next(new AppError('no role found with this ID ', 404))
  }
  user.role_id = roleId
  await user.save()
  res.status(200).json({
    status: 'success',
    message: `user : ${user.username} assigned to role : ${role.name} successfully `,
  })
})
const getRolePages = catchAsync(async (req, res, next) => {
  const id = req.params.id
  const user = await User.findOne({ where: { role_id: id } })
  if (!user) {
    return next(
      new AppError(
        'no user attched to this role !you must be attached to role',
        401,
      ),
    )
  }
  const permissions = await Role.findOne({
    where: { id },
    include: {
      model: Page,
      as: 'pages', // This should match the alias used in the association
      through: {
        model: RolePage,
        as: 'actions', // Specify the through model to access actions
        attributes: ['actions'], // Include the actions field
      },
      attributes: ['id', 'name'], // Only select the fields you need
    },
  })
  res.status(200).json({
    status: 'success',
    pages: permissions.pages,
  })
})
module.exports = {
  createRole,
  deleteRole,
  updateRole,
  getRoles,
  deleteAllRoles,
  assignRoleToUser,
  getUsersAndRoles,
  getRolePages,
}
