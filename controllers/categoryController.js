const { Category } = require('../models')
const multer = require('multer')
const fs = require('fs').promises // Ensure you use the Promise-based version of fs
const path = require('path')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

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

const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body
  let image
  if (req.file.filename) {
    image = req.file.filename
  }
  const category = await Category.create({ name, image })
  res.status(201).json(category)
})

const getCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.findAll()
  res.status(200).json(categories)
})

const getCategoryById = async (req, res, next) => {
  const { id } = req.params
  const category = await Category.findByPk(id)
  if (!category) {
    return next(new AppError('Category not found!', 404))
  }
  res.status(200).json(category)
}

const updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { name, image } = req.body
  const category = await Category.findByPk(id)
  if (!category) {
    return next(new AppError('Category to update no found!', 404))
  }
  await category.update({ name, image })
  res.status(200).json(category)
})

const deleteCategory = async (req, res, next) => {
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
    return next(new AppError('category to delete not found !', 404))
  }
}
const deleteAllCategories = catchAsync(async (req, res, next) => {
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
})
module.exports = {
  createCategory,
  uploadCategoryPhoto,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  deleteAllCategories,
}
