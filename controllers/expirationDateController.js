const { where } = require('sequelize');
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
    const expirationDates = req.body; // Expecting an array of expiration date objects

    // Create an array of promises for updating expiration dates
    const updatePromises = expirationDates.map(async ({ date, alert_interval, productId, supplyId, newProductId }) => {
      const targetProductId = newProductId || productId; // Use newProductId if provided, otherwise fallback to productId

      // Find the existing ExpirationDate
      let expirationDate = await ExpirationDate.findOne({
        where: {
          productId: targetProductId,
          supplyId: supplyId,
        },
      });

      if (expirationDate) {
        // Update the expiration date if it exists
        expirationDate.date = date !== undefined ? date : expirationDate.date;
        expirationDate.alert_interval = alert_interval !== undefined ? alert_interval : expirationDate.alert_interval;
        expirationDate.productId = targetProductId; // Update to newProductId if provided
        await expirationDate.save();
      } else {
        // Create a new expiration date if it doesn't exist
        expirationDate = await ExpirationDate.create({
          date,
          alert_interval,
          productId: targetProductId,
          supplyId,
        });
      }

      return expirationDate; // Return the created or updated expiration date
    });

    // Wait for all the update or creation operations to complete
    const results = await Promise.all(updatePromises);

    // Check if any errors occurred during the updates
    const errors = results.filter((result) => result.error);
    if (errors.length > 0) {
      res.status(206).json({ message: 'Some updates were successful, but some failed', errors });
    } else {
      res.status(200).json({ message: 'All expiration dates updated successfully', results });
    }
  } catch (error) {
    console.error('Error updating expiration dates:', error);
    res.status(500).json({ error: 'Failed to update expiration dates' });
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

const getExpirationDateBySupplyId = async (req, res) => {
  try {
    const { supplyId } = req.params;
    const expirationDate = await ExpirationDate.findAll(
      {
        where : {
          supplyId: supplyId
        },
      },
    );
    if (expirationDate) {
      res.status(200).json(expirationDate);
    } else {
      res.status(404).json({ error: 'Expiration date not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expiration date' });
  }
};

module.exports = {
  createExpirationDate,
  getExpirationDates,
  getExpirationDateById,
  updateExpirationDate,
  deleteExpirationDate,
  getExpirationDateBySupplyId,
};
