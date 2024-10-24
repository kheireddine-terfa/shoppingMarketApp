const fs = require('fs')
const path = require('path')
const { Page, Role, RolePage, User, sequelize } = require('./models') // Import your models

// Paths to JSON files
const pagesFilePath = path.join(__dirname, 'dev_data', 'pages.json')
const rolesFilePath = path.join(__dirname, 'dev_data', 'role.json')

// Function to read JSON files
function readJsonFileSync(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

// Function to check and insert pages
async function checkAndInsertPages() {
  try {
    const existingPages = await Page.findAll()
    if (existingPages.length === 0) {
      console.log('No pages found, inserting data from pages.json...')
      const pagesData = readJsonFileSync(pagesFilePath)

      await Page.bulkCreate(pagesData)
      console.log('Pages inserted successfully.')
    } else {
      console.log('Pages already exist in the database.')
    }
  } catch (error) {
    console.error('Error while inserting pages:', error)
  }
}

// Function to check and insert admin role
async function checkAndInsertAdminRole() {
  try {
    const adminRole = await Role.findOne({
      where: { name: 'admin' },
    })

    if (!adminRole) {
      console.log('Admin role not found, inserting data from role.json...')
      const roleData = readJsonFileSync(rolesFilePath)
      const { name, permissions } = roleData

      const newAdminRole = await Role.create({
        name,
      })

      console.log('Admin role created successfully.')

      // Iterate over the permissions array
      for (const permission of permissions) {
        const { page, actions } = permission

        // Find the page by name
        const foundPage = await Page.findOne({ where: { name: page } })

        // Create the RolePage entry with the role, page, and actions
        // eslint-disable-next-line
        const rolePage = await RolePage.create({
          role_id: newAdminRole.id,
          page_id: foundPage.id,
          actions, // This will store the actions as a string (e.g., 'update,view,add')
        })
      }

      console.log('RolePage associations created successfully.')
    } else {
      console.log('Admin role already exists.')
    }
  } catch (error) {
    console.error('Error while inserting admin role:', error)
  }
}

// Function to create the admin user
async function createAdminUser() {
  try {
    const adminRole = await Role.findOne({ where: { name: 'admin' } })
    const adminUser = await User.findOne({
      where: { role_id: adminRole.id },
    })

    if (!adminUser) {
      console.log('No admin user found, creating an admin user...')

      await User.create({
        username: process.env.USER_NAME,
        password: process.env.PASSWORD,
        passwordConfirm: process.env.PASSWORD,
        role_id: adminRole.id,
      })

      console.log('Admin user created successfully.')
    } else {
      console.log('Admin user already exists.')
    }
  } catch (error) {
    console.error('Error while creating admin user:', error)
  }
}

// Main initialization function
async function initializeApp() {
  try {
    await sequelize.sync({ force: false }) // Sync the database
    console.log('Database & tables synced!')

    await checkAndInsertPages()
    await checkAndInsertAdminRole()
    await createAdminUser()

    console.log('App initialization complete!')
  } catch (error) {
    console.error('Error during app initialization:', error)
  }
}

// Export the initializeApp function for external use
module.exports = { initializeApp }
