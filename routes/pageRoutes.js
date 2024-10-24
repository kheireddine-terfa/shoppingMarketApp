const express = require('express')
const {
  createPage,
  getPages,
  deleteAllPages,
  updatePage,
} = require('../controllers/pageController')
const router = express.Router()
router.route('/').post(createPage).get(getPages).delete(deleteAllPages)
router.route('/:id').patch(updatePage)
module.exports = router
