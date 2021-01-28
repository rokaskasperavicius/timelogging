const express = require('express')
const app = express.Router()
const { Client } = require('pg')

require('dotenv').config()

// const connection = process.env.DATABASE_URL

// const databaseConfig = {
//   connectionString: connection,
//   ssl: {
//     sslmode: 'require',
//     rejectUnauthorized: false,
//   }
// }

app.get('/test', (req, res) => {
  res.json({
    message: 'SUCCESS',
  })
})

module.exports = app