const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Database setup
const dbFolderPath = path.join('C:', 'DataBases', 'productsDataBase');
const dbFilePath = path.join(dbFolderPath, 'database.db');

if (!fs.existsSync(dbFolderPath)) {
  fs.mkdirSync(dbFolderPath, { recursive: true });
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbFilePath,
});

// Import models
const ProductModel = require('./productModel');
const SupplierModel = require('./supplierModel');
const SupplyModel = require('./supplyModel');
const ExpenseModel = require('./expenseModel');
const SaleModel = require('./saleModel');
const ExpirationDateModel = require('./expirationDateModel');
const CategoryModel = require('./categoryModel');
const ProductSaleModel = require('./productSaleModel');
const ProductSupplyModel = require('./productSupplyModel');

// Initialize models
const Product = ProductModel(sequelize, DataTypes);
const Supplier = SupplierModel(sequelize, DataTypes);
const Supply = SupplyModel(sequelize, DataTypes);
const Expense = ExpenseModel(sequelize, DataTypes);
const Sale = SaleModel(sequelize, DataTypes);
const ExpirationDate = ExpirationDateModel(sequelize, DataTypes);
const Category = CategoryModel(sequelize, DataTypes);
const ProductSale = ProductSaleModel(sequelize, DataTypes);
const ProductSupply = ProductSupplyModel(sequelize, DataTypes);  

// Define associations
Product.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(Product, { foreignKey: 'categoryId' });

Product.hasMany(ExpirationDate, { foreignKey: 'productId' });
ExpirationDate.belongsTo(Product, { foreignKey: 'productId' });

Product.belongsToMany(Supply, { through: ProductSupply, foreignKey: 'productId' });
Supply.belongsToMany(Product, { through: ProductSupply, foreignKey: 'supplyId' });

Product.belongsToMany(Sale, { through: ProductSale, foreignKey: 'productId' });
Sale.belongsToMany(Product, { through: ProductSale, foreignKey: 'saleId' });

// Sync database
sequelize.sync({ force: true }).then(() => {
  console.log("Database & tables created!");
});

module.exports = {
  sequelize,
  Product,
  Supplier,
  Supply,
  Expense,
  Sale,
  ExpirationDate,
  Category,
  ProductSale,
};
