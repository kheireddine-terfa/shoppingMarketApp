const { Sale } = require('../models');

const createSale = async (req, res) => {
  try {
    const { date, amount, paid_amount, remaining_amount } = req.body;
    const sale = await Sale.create({ date, amount, paid_amount, remaining_amount });
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sale' });
  }
};

const getSales = async (req, res) => {
  try {
    const sales = await Sale.findAll();
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
};

const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findByPk(id);
    if (sale) {
      res.status(200).json(sale);
    } else {
      res.status(404).json({ error: 'Sale not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sale' });
  }
};

const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, amount, paid_amount, remaining_amount } = req.body;
    const sale = await Sale.findByPk(id);
    if (sale) {
      await sale.update({ date, amount, paid_amount, remaining_amount });
      res.status(200).json(sale);
    } else {
      res.status(404).json({ error: 'Sale not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update sale' });
  }
};

const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findByPk(id);
    if (sale) {
      await sale.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Sale not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete sale' });
  }
};

module.exports = {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
};
