const mongoose = require('mongoose')
const { getConnectionUrl } = require('../startup/database')

const connectionUrl = getConnectionUrl()

async function connectToTestingDB () {
    //console.log(`Connecting to mongodb using: ${connectionUrl}`)
    await mongoose.connect(connectionUrl)
    if (mongoose.connection.readyState !== 1)
        console.log(`Connection status ${mongoose.connection.readyState}`)
}

async function disconnectTestingDB () {
    //console.log('Disconnecting from mongodb...')
    await mongoose.connection.close()
    if (mongoose.connection.readyState !== 0)
        console.log(`Connection status ${mongoose.connection.readyState}`)
}

module.exports = {
    connectToTestingDB,
    disconnectTestingDB,
    connectionUrl
}