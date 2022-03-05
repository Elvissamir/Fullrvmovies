require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const { connectToDB } = require('./startup/database')

require('./startup/logging')()
require('./startup/config')()
require('./startup/cors')(app)
require('./startup/prod')(app)
require('./startup/routes')(app)
connectToDB()

module.exports = app