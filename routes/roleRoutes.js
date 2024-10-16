const express = require('express')
const {
  createRole,
  getRoles,
  deleteAllRoles,
  deleteRole,
  updateRole,
  getUsersAndRoles,
  assignRoleToUser,
} = require('../controllers/roleController')
const router = express.Router()
router.route('/').post(createRole).get(getRoles).delete(deleteAllRoles)
router.route('/:id').delete(deleteRole).patch(updateRole)
router.route('/assign').get(getUsersAndRoles).post(assignRoleToUser)
module.exports = router
