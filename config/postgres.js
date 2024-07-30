require('dotenv').config()
  
const Pool = require('pg').Pool

const pool = new Pool({
    user: process.env.POSTGRES_DB_NAME,
    host: process.env.POSTGRES_DB_HOST,// '172.17.0.1',
    database: process.env.POSTGRES_DB_DATABASE,
    password: process.env.POSTGRES_DB_PASS,
    port: process.env.POSTGRES_DB_PORT,
  })
  

  module.exports = {
    pool      
  }