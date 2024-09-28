const { Sequelize, DataTypes } = require('sequelize')
const path = require('path')
const fs = require('fs')

// Database setup
const dbFolderPath = path.join('C:', 'DataBases', 'productsDataBase')
const dbFilePath = path.join(dbFolderPath, 'database.db')

if (!fs.existsSync(dbFolderPath)) {
  fs.mkdirSync(dbFolderPath, { recursive: true })
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbFilePath,
})

// Import models
const UserModel = require('./userModel')
const RoleModel = require('./roleModel')
const PageModel = require('./pageModel')
const RolePageModel = require('./rolePageModel')
const ProductModel = require('./productModel')
const SupplierModel = require('./supplierModel')
const SupplyModel = require('./supplyModel')
const ExpenseModel = require('./expenseModel')
const SaleModel = require('./saleModel')
const ExpirationDateModel = require('./expirationDateModel')
const CategoryModel = require('./categoryModel')
const ProductSaleModel = require('./productSaleModel')
const ProductSupplyModel = require('./productSupplyModel')

// Initialize models
const User = UserModel(sequelize, DataTypes)
const Role = RoleModel(sequelize, DataTypes)
const Page = PageModel(sequelize, DataTypes)
const RolePage = RolePageModel(sequelize, DataTypes)
const Product = ProductModel(sequelize, DataTypes)
const Supplier = SupplierModel(sequelize, DataTypes)
const Supply = SupplyModel(sequelize, DataTypes)
const Expense = ExpenseModel(sequelize, DataTypes)
const Sale = SaleModel(sequelize, DataTypes)
const ExpirationDate = ExpirationDateModel(sequelize, DataTypes)
const Category = CategoryModel(sequelize, DataTypes)
const ProductSale = ProductSaleModel(sequelize, DataTypes)
const ProductSupply = ProductSupplyModel(sequelize, DataTypes)

// Define associations
Product.belongsTo(Category, { foreignKey: 'categoryId' })
Category.hasMany(Product, { foreignKey: 'categoryId' })

Product.hasMany(ExpirationDate, { foreignKey: 'productId' })
ExpirationDate.belongsTo(Product, { foreignKey: 'productId' })

Product.belongsToMany(Supply, {
  through: ProductSupply,
  foreignKey: 'productId',
})
Supply.belongsToMany(Product, {
  through: ProductSupply,
  foreignKey: 'supplyId',
})

// ProductSale associations
Product.belongsToMany(Sale, {
  through: ProductSale,
  foreignKey: 'productId',
  as: 'Sales',
})
Sale.belongsToMany(Product, {
  through: ProductSale,
  foreignKey: 'saleId',
  as: 'Products',
})

// Ensure you define the reverse association as well if needed
ProductSale.belongsTo(Product, { foreignKey: 'productId', as: 'Product' })
ProductSale.belongsTo(Sale, { foreignKey: 'saleId', as: 'Sale' })

User.belongsTo(Role, { foreignKey: 'role_id', as: 'role', onDelete: 'CASCADE' })

Role.belongsToMany(Page, {
  through: RolePage,
  foreignKey: 'role_id',
  as: 'pages',
  onDelete: 'CASCADE',
})
Page.belongsToMany(Role, {
  through: RolePage,
  foreignKey: 'page_id',
  as: 'roles',
  onDelete: 'CASCADE',
})
// Sync database without forcing table recreation

sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables synced without dropping existing data!')
})

module.exports = {
  sequelize,
  User,
  Product,
  Supplier,
  Supply,
  Expense,
  Sale,
  ExpirationDate,
  Category,
  ProductSale,
  Page,
  Role,
  RolePage,
}
