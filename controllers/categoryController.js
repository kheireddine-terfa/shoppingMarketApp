const { Category } = require('../models')
const multer = require('multer')
const fs = require('fs').promises // Ensure you use the Promise-based version of fs
const path = require('path')
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/categoriesImages')
  },
  filename: (req, file, cb) => {
    let nameWithoutWhiteSpace = req.body.name.replace(/\s+/g, '')
    const ext = file.mimetype.split('/')[1]
    cb(null, `category-${nameWithoutWhiteSpace}-${Date.now()}.${ext}`)
  },
})
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new Error('not an image , please upload an image file'), false)
  }
}
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
})
const uploadCategoryPhoto = upload.single('image')

const createCategory = async (req, res) => {
  try {
    const { name } = req.body
    let image
    if (req.file.filename) {
      image = req.file.filename
    }
    const category = await Category.create({ name, image })
    res.status(201).json(category)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' })
  }
}

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll()
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
}

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params
    const category = await Category.findByPk(id)
    if (category) {
      res.status(200).json(category)
    } else {
      res.status(404).json({ error: 'Category not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' })
  }
}

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { name, image } = req.body
    const category = await Category.findByPk(id)
    if (category) {
      await category.update({ name, image })
      res.status(200).json(category)
    } else {
      res.status(404).json({ error: 'Category not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' })
  }
}

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params
    const category = await Category.findByPk(id)

    if (category) {
      // Save the image path before destroying the category
      const imagePath = category.image
        ? `public/categoriesImages/${category.image}`
        : null

      // Delete the category record from the database
      await category.destroy()
      // Delete the associated image if it exists
      if (imagePath) {
        try {
          await fs.unlink(imagePath)
          console.log(`Image deleted: ${imagePath}`)
        } catch (err) {
          console.error(`Failed to delete image: ${imagePath}`, err)
        }
      }

      res.status(204).send()
    } else {
      res.status(404).json({ error: 'category not found' })
    }
  } catch (error) {
    console.error('Error deleting category:', error)
    res.status(500).json({ error: 'Failed to delete category' })
  }
}
const deleteAllCategories = async (req, res) => {
  try {
    // Define the directory containing the product images
    const imagesDirectory = path.join(
      __dirname,
      '..',
      'public',
      'categoriesImages',
    )

    // Read all files in the directory
    const files = await fs.readdir(imagesDirectory)

    // Iterate over the files and delete each one
    for (const file of files) {
      try {
        const filePath = path.join(imagesDirectory, file)
        if (file !== 'default_image.png') {
          await fs.unlink(filePath)
          console.log(`Deleted image: ${filePath}`)
        }
      } catch (err) {
        console.error(`Failed to delete image: ${file}`, err)
      }
    }
    // Delete all products from the database
    await Category.destroy({ where: {}, truncate: true })

    // Reset the auto-increment sequence (for SQLite)
    await Category.sequelize.query(
      "DELETE FROM sqlite_sequence WHERE name='Categories';",
    )

    res
      .status(200)
      .json({ message: 'All Categorys and images deleted successfully' })
  } catch (error) {
    console.error('Error deleting Categorys and images:', error)
    res.status(500).json({ error: error.message })
  }
}
module.exports = {
  createCategory,
  uploadCategoryPhoto,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  deleteAllCategories,
}
