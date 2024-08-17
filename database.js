const { Sequelize, DataTypes } = require('sequelize');
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
  logging: console.log, // Enable logging to see SQL queries
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    // Define a simple model
    const TestModel = sequelize.define('TestModel', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    // Synchronize the model
    await sequelize.sync({ force: true }); // Use force: true to recreate the table
    console.log('TestModel table created successfully.');

    // Test inserting data
    await TestModel.create({ name: 'Sample Name' });
    console.log('Sample data inserted successfully.');

    // Test fetching data
    const records = await TestModel.findAll();
    console.log('Records:', records);
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
