require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const { connectToDB } = require('./startup/database')
const { runMigrations } = require('./database/migrationsHandler')

require('./startup/exceptionsHandler')()
require('./startup/config')()
require('./startup/cors')(app)
require('./startup/prod')(app)
require('./startup/routes')(app)

if (process.env.APP_ENV !== 'testing') {
    connectToDB()
    runMigrations()
}

module.exports = app