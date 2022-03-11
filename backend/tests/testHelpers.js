const mongoose = require('mongoose')
const { getConnectionUrl } = require('../startup/database')

const connectionUrl = getConnectionUrl()

async function connectToTestingDB () {
    await mongoose.connect(connectionUrl)
    if (mongoose.connection.readyState !== 1)
        console.log(`Connection status ${mongoose.connection.readyState}`)
}

async function disconnectTestingDB () {
    await mongoose.connection.close()
    if (mongoose.connection.readyState !== 0)
        console.log(`Connection status ${mongoose.connection.readyState}`)
}

module.exports = {
    connectToTestingDB,
    disconnectTestingDB,
    connectionUrl
}