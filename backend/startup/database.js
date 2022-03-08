const mongoose = require('mongoose')
const winston = require('winston')
const logger = require('./logger')

function getConnectionUrl () {
    const mongoBaseUrl = (process.env.DEV_USING_DOCKER == "true")? process.env.DEV_MONGO_CONTAINER_URL : process.env.DEV_MONGO_LOCAL_URL 
    const databaseName = (process.env.APP_ENV == "development")? process.env.DEV_DATABASENAME : process.env.TESTING_DATABASENAME
    return `${mongoBaseUrl}/${databaseName}`
}

logger.add(new winston.transports.MongoDB({ db: getConnectionUrl(), level: 'error', tryReconnect: true, options: { useUnifiedTopology: true }}))

async function connect() {
    const connectionUrl = getConnectionUrl()
    logger.info(`(MONGOOSE) Using url: ${getConnectionUrl()}`)
    await mongoose.connect(connectionUrl)
}

async function connectToDB() {
    await connect()
        .then(() => logger.info('(MONGOOSE) Connected to MONGODB...'))
}

async function disconnectDB() {
    logger.info('(MONGOOSE) Closing connection...')
    await mongoose.connection.close()
}

module.exports = {
    connectToDB,
    disconnectDB,
    getConnectionUrl,
}