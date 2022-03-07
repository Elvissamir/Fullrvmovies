require('dotenv').config()
require('express-async-errors')
const express = require('express')
const { runMigrations } = require('./database/migrations')
const app = express()
const { connectToDB } = require('./startup/database')

require('./startup/logging')()
require('./startup/config')()
require('./startup/cors')(app)
require('./startup/prod')(app)
require('./startup/routes')(app)

if (process.env.APP_ENV !== 'testing') {
    connectToDB()
    runMigrations()
}

module.exports = app