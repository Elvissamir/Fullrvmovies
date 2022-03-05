const app = require('./app')
const winston = require('winston')

const port = process.env.PORT || process.env.DEV_PORT
app.listen(port, () => {
    winston.info(`(NODE) Listening to port ${port}...`)
})
