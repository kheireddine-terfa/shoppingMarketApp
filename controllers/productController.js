const { Product } = require('../models')
const multer = require('multer')
const fs = require('fs').promises // Ensure you use the Promise-based version of fs
const path = require('path')

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/productsImages')
  },
  filename: (req, file, cb) => {
    let nameWithoutWhiteSpace = req.body.name.replace(/\s+/g, '')
    const ext = file.mimetype.split('/')[1]
    cb(null, `product-${nameWithoutWhiteSpace}-${Date.now()}.${ext}`)
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
const uploadProductPhoto = upload.single('image')
const createProduct = async (req, res) => {
  try {
    const { name, price, bare_code, quantity, min_quantity } = req.body
    let image
    if (req.file.filename) {
      image = req.file.filename
    }
    const product = await Product.create({
      name,
      price,
      bare_code,
      quantity,
      min_quantity,
      image,
    })
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ error })
  }
}

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll()
    console.log(products)
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ error })
  }
}

const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findByPk(id)
    if (product) {
      res.status(200).json(product)
    } else {
      res.status(404).json({ error: 'Product not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
}

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { name, price, bare_code, quantity, min_quantity } = req.body
    const product = await Product.findByPk(id)
    if (product) {
      await product.update({ name, price, bare_code, quantity, min_quantity })
      res.status(200).json(product)
    } else {
      res.status(404).json({ error: 'Product not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findByPk(id)

    if (product) {
      // Save the image path before destroying the product
      const imagePath = product.image
        ? `public/productsImages/${product.image}`
        : null

      // Delete the product record from the database
      await product.destroy()

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
      res.status(404).json({ error: 'Product not found' })
    }
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ error: 'Failed to delete product' })
  }
}

const deleteAllProducts = async (req, res) => {
  try {
    // Define the directory containing the product images
    const imagesDirectory = path.join(
      __dirname,
      '..',
      'public',
      'productsImages',
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
    await Product.destroy({ where: {}, truncate: true })

    // Reset the auto-increment sequence (for SQLite)
    await Product.sequelize.query(
      "DELETE FROM sqlite_sequence WHERE name='Products';",
    )

    res
      .status(200)
      .json({ message: 'All products and images deleted successfully' })
  } catch (error) {
    console.error('Error deleting products and images:', error)
    res.status(500).json({ error: error.message })
  }
}
module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductPhoto,
  deleteAllProducts,
}
