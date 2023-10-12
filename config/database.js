require('dotenv').config()

module.exports = {
  hrPool: {
  user: process.env.DB_NAME,
  password: process.env.DB_PASS,
  connectString:  process.env.DB_HOST,
  poolMin: 10,
  poolMax: 10,
  poolIncrement: 0
  }
};
