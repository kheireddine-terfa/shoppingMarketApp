const express = require('express')
const {
  createRole,
  getRoles,
  deleteAllRoles,
  deleteRole,
  updateRole,
  getUsersAndRoles,
  assignRoleToUser,
  getRolePages,
} = require('../controllers/roleController')
const router = express.Router()
router.route('/').post(createRole).get(getRoles).delete(deleteAllRoles)
router.route('/assign').get(getUsersAndRoles).post(assignRoleToUser)
router.route('/:id').delete(deleteRole).patch(updateRole).get(getRolePages)

module.exports = router
