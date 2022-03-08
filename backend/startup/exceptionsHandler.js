const logger = require('./logger')

module.exports = function () {
    process.on('uncaughtException', (ex) => {
        logger.error(ex.message, ex)
        process.exit(1)
    })
    
    process.on('unhandledRejection', (ex) => {
        logger.error(ex.message, ex)
        process.exit(1)
    })
}