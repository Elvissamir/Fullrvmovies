const app = require('./app')
const logger = require('./startup/logger')

const port = process.env.PORT || process.env.DEV_PORT
app.listen(port, () => {
    logger.info(`(NODE) Listening to port ${port}...`)
})
