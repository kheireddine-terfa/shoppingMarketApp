const { Product } = require('../models')
const { ExpirationDate } = require('../models')
const multer = require('multer')
const fs = require('fs').promises // Ensure you use the Promise-based version of fs
const path = require('path')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
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

// create product controller:
const createProduct = catchAsync(async (req, res, next) => {
  const {
    name,
    price,
    purchase_price,
    bare_code,
    quantity,
    min_quantity,
    balanced_product,
    category,
    hasBarCode,
    expiration_date,
    alert_interval,
  } = req.body
  let image
  if (req.file.filename) {
    image = req.file.filename
  }

  const product = await Product.create({
    name,
    price,
    purchase_price,
    bare_code,
    quantity,
    min_quantity,
    image,
    categoryId: category,
    balanced_product,
    hasBarCode,
  })
  const productId = product.id
  const expirationDate = await ExpirationDate.create({
    date: expiration_date,
    alert_interval,
    productId,
  })
  res.status(201).json({ product, expirationDate })
})
// get all products controller :
const getProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    include: [
      {
        model: ExpirationDate,
        order: [['date', 'ASC']],
        attributes: ['alert_interval', 'date'],
      },
    ],
  })
  res.status(200).json(products)
})
// get product by id controller
const getProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params

  // Fetch the product by its primary key (ID)
  const product = await Product.findByPk(id)

  // Check if the product was found before accessing its properties
  if (!product) {
    // If no product is found, trigger the custom error handling
    return next(new AppError('No product found with this id', 404))
  }

  // Fetch the expiration date using the product's ID
  const expDate = await ExpirationDate.findOne({
    where: { productId: product.id },
  })

  // Send the product and expiration date in the response
  res.status(200).json({ product, expDate })
})

//update product controller :
const updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const product = await Product.findByPk(id)
  if (!product) {
    return next(new AppError('no product found with this id', 404))
  }
  // Step 2: Delete the old image if a new image is uploaded
  if (req.file && product.image) {
    const oldImagePath = `public/productsImages/${product.image}`
    await fs.unlink(oldImagePath)
  }
  // Step 3: Update the product document with the new data
  const updatedData = req.body
  updatedData.image = req.file ? req.file.filename : product.image

  // Update the fields
  product.name = updatedData.name || product.name
  product.price = updatedData.price || product.price
  product.purchase_price = updatedData.purchase_price || product.purchase_price
  product.bare_code = updatedData.bare_code || product.bare_code
  product.quantity = updatedData.quantity || product.quantity
  product.min_quantity = updatedData.min_quantity || product.min_quantity
  product.image = updatedData.image || product.image
  product.categoryId = updatedData.category || product.categoryId
  // Save the updated product to the database
  const updatedProduct = await product.save()
  if (req.body.alert_interval) {
    const expDate = await ExpirationDate.findOne({
      where: {
        productId: id, // Condition to match
      },
    })
    expDate.alert_interval = req.body.alert_interval
    await expDate.save()
  }
  if (req.body.expiration_date) {
    const oldExpDate = await ExpirationDate.findOne({
      where: {
        productId: id, // Condition to match
      },
    })
    // eslint-disable-next-line
    const newExpDate = await ExpirationDate.create({
      date: req.body.expiration_date,
      alert_interval: oldExpDate.alert_interval,
      productId: product.id,
    })
  }
  res.status(200).json({ updatedProduct })
})
// delete peoduct controller :
const deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const product = await Product.findByPk(id)
  if (!product) {
    return next(new AppError('product to delete not found', 404))
  }
  // Save the image path before destroying the product
  const imagePath = product.image
    ? `public/productsImages/${product.image}`
    : null

  // delete the associated exp dates :
  await ExpirationDate.destroy({
    where: {
      productId: product.id,
    },
  })
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
})

const deleteAllProducts = catchAsync(async (req, res, next) => {
  // Define the directory containing the product images
  const imagesDirectory = path.join(__dirname, '..', 'public', 'productsImages')

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
  // Delete all ExpirationDates from the database
  await ExpirationDate.destroy({ where: {} })
  // Reset the auto-increment sequence (for SQLite)
  await ExpirationDate.sequelize.query(
    "DELETE FROM sqlite_sequence WHERE name='ExpirationDates';",
  )
  // Delete all products from the database
  await Product.destroy({ where: {}, truncate: true })

  // Reset the auto-increment sequence (for SQLite)
  await Product.sequelize.query(
    "DELETE FROM sqlite_sequence WHERE name='Products';",
  )

  res
    .status(200)
    .json({ message: 'All products and images deleted successfully' })
})
const getProductsWithoutBarcode = catchAsync(async (req, res, next) => {
  const productsWithoutBarcode = await Product.findAll({
    where: {
      hasBarCode: false,
    },
  })
  res.status(200).json(productsWithoutBarcode)
})

const getProductByBarcode = catchAsync(async (req, res, next) => {
  const { barcode } = req.params
  // Fetch the product by barcode
  const product = await Product.findOne({ where: { bare_code: barcode } })

  if (!product) {
    return next(new AppError('product not found !', 404))
  }

  res.status(200).json(product)
})

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsWithoutBarcode,
  getProductByBarcode,
  uploadProductPhoto,
  deleteAllProducts,
}
