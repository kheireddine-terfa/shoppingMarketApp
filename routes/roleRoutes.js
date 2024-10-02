const express = require('express')
const {
  createRole,
  getRoles,
  deleteAllRoles,
  deleteRole,
  updateRole,
} = require('../controllers/roleController')
const router = express.Router()
router.route('/').post(createRole).get(getRoles).delete(deleteAllRoles)
router.route('/:id').delete(deleteRole).patch(updateRole)
module.exports = router
