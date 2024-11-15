const { where } = require('sequelize');
const { ExpirationDate } = require('../models');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const createExpirationDate = catchAsync(async (req, res, next) => {
  const { date, alert_interval, productId } = req.body;
  const expirationDate = await ExpirationDate.create({ date, alert_interval, productId });
  res.status(201).json(expirationDate);
});

const getExpirationDates = catchAsync(async (req, res, next) => {
  const expirationDates = await ExpirationDate.findAll();
  if (expirationDates) {
    res.status(200).json(expirationDates);
  } else {
    return next(new AppError("No expiration dates found", 404));
  }
});

const getExpirationDateById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const expirationDate = await ExpirationDate.findByPk(id);
  if (expirationDate) {
    res.status(200).json(expirationDate);
  } else {
    return next(new AppError("Expiration date not found", 404));
  }
});

const updateExpirationDate = catchAsync(async (req, res, next) => {
  const expirationDates = req.body; // Expecting an array of expiration date objects

  const updatePromises = expirationDates.map(async ({ date, alert_interval, productId, supplyId, newProductId }) => {
    const targetProductId = newProductId || productId;

    let expirationDate = await ExpirationDate.findOne({
      where: {
        productId: targetProductId,
        supplyId: supplyId,
      },
    });

    if (expirationDate) {
      expirationDate.date = date !== undefined ? date : expirationDate.date;
      expirationDate.alert_interval = alert_interval !== undefined ? alert_interval : expirationDate.alert_interval;
      expirationDate.productId = targetProductId;
      await expirationDate.save();
    } else {
      expirationDate = await ExpirationDate.create({
        date,
        alert_interval,
        productId: targetProductId,
        supplyId,
      });
    }

    return expirationDate;
  });

  const results = await Promise.all(updatePromises);

  const errors = results.filter((result) => result.error);
  if (errors.length > 0) {
    return next(new AppError("Some updates were successful, but some failed", 206));
  } else {
    res.status(200).json({ message: "All expiration dates updated successfully" });
  }
});

const deleteExpirationDate = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const expirationDate = await ExpirationDate.findByPk(id);
  if (expirationDate) {
    await expirationDate.destroy();
    res.status(204).send();
  } else {
    return next(new AppError("Expiration date not found", 404));
  }
});

const getExpirationDateBySupplyId = catchAsync(async (req, res, next) => {
  const { supplyId } = req.params;
  const expirationDates = await ExpirationDate.findAll({
    where: { supplyId },
  });
  if (expirationDates && expirationDates.length > 0) {
    res.status(200).json(expirationDates);
  } else {
    return next(new AppError("Expiration dates not found for the given supply ID", 404));
  }
});

module.exports = {
  createExpirationDate,
  getExpirationDates,
  getExpirationDateById,
  updateExpirationDate,
  deleteExpirationDate,
  getExpirationDateBySupplyId,
};
