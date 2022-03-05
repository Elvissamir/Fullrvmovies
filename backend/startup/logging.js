const { connectionUrl } = require("./database")
const winston = require('winston')
// require('winston-mongodb')

module.exports = function () {
    process.on('uncaughtException', (ex) => {
        winston.error(ex.message, ex)
        process.exit(1)
    })
    
    process.on('unhandledRejection', (ex) => {
        winston.error(ex.message, ex)
        process.exit(1)
    })
    
    winston.add(new winston.transports.File({filename: 'logfile.log' }))
    winston.add(new winston.transports.Console({format: winston.format.printf(log => log.message)}))
    // winston.add(new winston.transports.MongoDB({ db: connectionUrl, level: 'error', tryReconnect: true, options: { useUnifiedTopology: true }}))
}