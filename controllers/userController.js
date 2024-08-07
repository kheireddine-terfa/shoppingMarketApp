const { User } = require('../models')
exports.deleteAllUsers = async (req, res) => {
  try {
    await User.destroy({ where: {}, truncate: true })
    await User.sequelize.query(
      "DELETE FROM sqlite_sequence WHERE name='Users';",
    )
    res.status(200).json({ message: 'All users deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
