const { Expense } = require('../models');

const createExpense = async (req, res) => {
  try {
    const { date, description, amount } = req.body;
    const expense = await Expense.create({ date, description, amount });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);
    if (expense) {
      res.status(200).json(expense);
    } else {
      res.status(404).json({ error: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expense' });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, description, amount } = req.body;
    const expense = await Expense.findByPk(id);
    if (expense) {
      await expense.update({ date, description, amount });
      res.status(200).json(expense);
    } else {
      res.status(404).json({ error: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);
    if (expense) {
      await expense.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
