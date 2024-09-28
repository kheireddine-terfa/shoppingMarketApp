const express = require('express')
const {
  createPage,
  getPages,
  deleteAllPages,
} = require('../controllers/pageController')
const router = express.Router()
router.route('/').post(createPage).get(getPages).delete(deleteAllPages)
module.exports = router
