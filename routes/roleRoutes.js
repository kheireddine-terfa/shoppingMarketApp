const express = require('express')
const {
  createRole,
  getRoles,
  deleteAllRoles,
} = require('../controllers/roleController')
const router = express.Router()
router.route('/').post(createRole).get(getRoles).delete(deleteAllRoles)
module.exports = router
