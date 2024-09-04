const express = require('express')
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  deleteAllCategories,
  uploadCategoryPhoto,
} = require('../controllers/categoryController')

const router = express.Router()

// Create a new category
router.post('/', uploadCategoryPhoto, createCategory)

// Get all categories
router.get('/', getCategories)
// delete all categories
router.delete('/', deleteAllCategories)

// Get a single category by ID
router.get('/:id', getCategoryById)

// Update a category by ID
router.put('/:id', uploadCategoryPhoto, updateCategory)

// Delete a category by ID
router.delete('/:id', deleteCategory)

module.exports = router
