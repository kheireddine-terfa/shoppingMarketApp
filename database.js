const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Paths to database folder and file
const dbFolderPath = path.join('C:', 'DataBases', 'productsDataBase');
const dbFilePath = path.join(dbFolderPath, 'database.db');

// Ensure the database directory exists
if (!fs.existsSync(dbFolderPath)) {
  fs.mkdirSync(dbFolderPath, { recursive: true });
}

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbFilePath,
  logging: false, // Disable logging if you don't want Sequelize to log SQL queries
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    // Synchronize the models, but avoid recreating the database
    await sequelize.sync({ alter: false, force: false }); // Ensure no force sync
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
