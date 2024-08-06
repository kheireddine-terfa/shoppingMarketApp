const { Sequelize } = require('sequelize');
const path = require('path');
const dbFolderPath = path.join('C:', 'DataBases', 'productsDataBase');
const dbFilePath = path.join(dbFolderPath, 'database.db');

// Ensure the database directory exists
const fs = require('fs');
if (!fs.existsSync(dbFolderPath)) {
  fs.mkdirSync(dbFolderPath, { recursive: true });
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbFilePath,
});

module.exports = sequelize;
