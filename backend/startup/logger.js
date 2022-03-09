const winston = require('winston')
require('winston-mongodb')

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({filename: 'logfile.log' }),
        new winston.transports.Console({
            format: winston.format.simple(),
            silent: process.env.APP_ENV === 'testing'? true:false,
        })
    ]
})


module.exports = logger