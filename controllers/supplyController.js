const { Supply, Supplier, Product, ProductSupply } = require('../models');
const { sequelize } = require('../models');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const createSupply = catchAsync(async (req, res, next) => {
  const { date, amount, description, paid_amount, remaining_amount, supplierId } = req.body;
  const supply = await Supply.create({
    date,
    amount,
    description,
    paid_amount,
    remaining_amount,
    supplierId
  });
  res.status(201).json(supply);
});

const getSupplies = catchAsync(async (req, res, next) => {
  const supplies = await Supply.findAll({});
  res.status(200).json(supplies);
});

const getSupplyById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const supply = await Supply.findByPk(id);
  if (!supply) {
    return next(new AppError('Supply not found', 404));
  }
  res.status(200).json(supply);
});

const updateSupply = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { amount, description, paid_amount, remaining_amount, supplierId } = req.body;
  const supply = await Supply.findByPk(id);

  if (!supply) {
    return next(new AppError('Supply not found', 404));
  }

  await supply.update({
    amount,
    description,
    paid_amount,
    remaining_amount,
    supplierId
  });
  res.status(200).json(supply);
});

const deleteSupply = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const supply = await Supply.findByPk(id);

  if (!supply) {
    return next(new AppError('Supply not found', 404));
  }

  // Get all associated ProductSupply entries for the supply
  const productSupplies = await ProductSupply.findAll({
    where: { supplyId: id },
  });

  for (const productSupply of productSupplies) {
    const product = await Product.findByPk(productSupply.productId);
    if (product) {
      const newQuantity = product.quantity - productSupply.quantity;
      await product.update({ quantity: Math.max(newQuantity, 0) });
    }
  }

  supply.supplierId = null;
  await supply.save();
  await supply.destroy();

  res.status(204).send();
});

const deleteAllSupplies = catchAsync(async (req, res, next) => {
  try {
    const productSupplies = await ProductSupply.findAll();

    for (const productSupply of productSupplies) {
      const product = await Product.findByPk(productSupply.productId);
      if (product) {
        const newQuantity = product.quantity - productSupply.quantity;
        await product.update({ quantity: Math.max(newQuantity, 0) });
      }
    }

    await Supply.destroy({ where: {}, truncate: true });
    await Supply.sequelize.query("DELETE FROM sqlite_sequence WHERE name='Supplies';");

    res.status(200).json({ message: 'All supplies deleted successfully' });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});

const getSuppliedProductsBySupplyId = catchAsync(async (req, res, next) => {
  const { supplyId } = req.params;
  const result = await sequelize.query(
    `SELECT 
        ProductSupplies.productId,
        ProductSupplies.quantity, 
        ProductSupplies.purchase_price,
        Products.name 
     FROM 
        ProductSupplies
     JOIN 
        Products ON Products.id = ProductSupplies.productId
     WHERE 
        ProductSupplies.supplyId = :supplyId`,
    {
      replacements: { supplyId },
      type: sequelize.QueryTypes.SELECT
    }
  );
  res.json(result);
});

const getSupplierBySupplyId = catchAsync(async (req, res, next) => {
  const { supplyId } = req.params;
  const supply = await Supply.findByPk(supplyId, { include: Supplier });

  if (!supply) {
    return next(new AppError('Supply not found', 404));
  }

  res.json(supply.Supplier);
});

module.exports = {
  createSupply,
  getSupplies,
  getSupplyById,
  updateSupply,
  deleteSupply,
  deleteAllSupplies,
  getSupplierBySupplyId,
  getSuppliedProductsBySupplyId,
};
