const { Page } = require('../models')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const createPage = catchAsync(async (req, res, next) => {
  const name = req.body.name.toLowerCase()
  const available_actions = req.body.available_actions
  const page = await Page.create({ name, available_actions })
  res.status(201).json(page)
})
const deletePage = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const page = Page.findByPk(id)
  if (!page) {
    return next(new AppError('page to delete not found!', 404))
  }
  await page.destroy()
  res.status(204).json({
    status: 'success',
    message: 'page deleted successfully',
  })
})
const updatePage = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const page = await Page.findByPk(id)
  if (!page) {
    return next(new AppError('page to update not found!', 404))
  }
  page.name = req.body.name
  const updatedPage = await page.save()
  res.status(200).json({
    status: 'success',
    updatedPage,
  })
})
const getPages = catchAsync(async (req, res, next) => {
  const pages = await Page.findAll()
  res.status(200).json({
    status: 'success',
    pages,
  })
})
const deleteAllPages = catchAsync(async (req, res, next) => {
  await Page.destroy({ where: {}, truncate: true })
  // Reset the auto-increment sequence (for SQLite)
  await Page.sequelize.query("DELETE FROM sqlite_sequence WHERE name='Pages';")
  res.status(204).json({
    status: 'success',
    message: 'all pages deleted successfully',
  })
})
module.exports = {
  createPage,
  deletePage,
  updatePage,
  getPages,
  deleteAllPages,
}
