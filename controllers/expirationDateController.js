const { ExpirationDate } = require('../models');

const createExpirationDate = async (req, res) => {
  try {
    const { date, alert_interval , productId } = req.body;
    const expirationDate = await ExpirationDate.create({ date, alert_interval , productId });
    res.status(201).json(expirationDate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expiration date' });
  }
};

const getExpirationDates = async (req, res) => {
  try {
    const expirationDates = await ExpirationDate.findAll();
    res.status(200).json(expirationDates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expiration dates' });
  }
};

const getExpirationDateById = async (req, res) => {
  try {
    const { id } = req.params;
    const expirationDate = await ExpirationDate.findByPk(id);
    if (expirationDate) {
      res.status(200).json(expirationDate);
    } else {
      res.status(404).json({ error: 'Expiration date not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expiration date' });
  }
};

const updateExpirationDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, alert_interval } = req.body;
    const expirationDate = await ExpirationDate.findByPk(id);
    if (expirationDate) {
      await expirationDate.update({ date, alert_interval });
      res.status(200).json(expirationDate);
    } else {
      res.status(404).json({ error: 'Expiration date not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expiration date' });
  }
};

const deleteExpirationDate = async (req, res) => {
  try {
    const { id } = req.params;
    const expirationDate = await ExpirationDate.findByPk(id);
    if (expirationDate) {
      await expirationDate.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Expiration date not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expiration date' });
  }
};

module.exports = {
  createExpirationDate,
  getExpirationDates,
  getExpirationDateById,
  updateExpirationDate,
  deleteExpirationDate,
};
