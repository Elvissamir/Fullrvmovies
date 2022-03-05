const mongoose = require('mongoose')
const winston = require('winston')
const mongoBaseUrl = (process.env.DEV_USING_DOCKER == "true")? process.env.DEV_MONGO_CONTAINER_URL : process.env.DEV_MONGO_LOCAL_URL 
const databaseName = (process.env.APP_ENV == "development")? process.env.DEV_DATABASENAME : process.env.TESTING_DATABASENAME
const connectionUrl = `${mongoBaseUrl}/${databaseName}`

async function connect() {
    winston.info(`(MONGOOSE) Using url: ${connectionUrl}`)
    await mongoose.connect(connectionUrl)
}

async function connectToDB() {
    await connect()
        .then(() => winston.info('(MONGOOSE) Connected to MONGODB...'))
}

module.exports = {
    connectToDB,
    connectionUrl
}