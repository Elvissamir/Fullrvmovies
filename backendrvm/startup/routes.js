const express = require('express')
const movies = require('../routes/movies')
const genres = require('../routes/genres')
const rentals = require('../routes/rentals')
const customers = require('../routes/customers')
const returns = require('../routes/returns')
const users = require('../routes/users')
const auth = require('../routes/auth')
const error = require('../middleware/error')

module.exports = function (app) {
    // Middleware
    app.use(express.json())
    // Routes
    app.use('/api/movies', movies)
    app.use('/api/genres', genres)
    app.use('/api/rentals', rentals)
    app.use('/api/customers', customers)
    app.use('/api/returns', returns)
    app.use('/api/users', users)
    app.use('/api/login', auth)
    // Error Middleware
    app.use(error)
}