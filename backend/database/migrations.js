const genresMigration = require('./genresMigration')
const moviesMigration = require('./moviesMigration')
const customersMigration = require('./customersMigration')

const migrations = [
    genresMigration,
    //moviesMigration,
    customersMigration
]

module.exports = {
    migrations
}