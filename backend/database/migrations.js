const winston = require('winston')
const { Genre } = require('../models/Genre')

const genres = [
    { name: 'Adventure'},
    { name: 'Romance' },
    { name: 'Drama' },
    { name: 'Action' },
    { name: 'Animation' },
    { name: 'Thriller' },
    { name: 'Comedy' },
    { name: 'Western' },
    { name: 'Sci-fi' },
    { name: 'Documentary' },
]

const doMigration = async ({ model, data }) => {
    await model.collection.insertMany(data)
}

const runMigrations = async (migrations) => {
    for (const migration of migrations) {
        try {
            await doMigration(migration)
        }
        catch (ex)
        {
            winston.info(`There was an error with migration for ${migration.name} model.`, ex)
            winston.info()
        }
    }
}

module.exports = {
    runMigrations,
    doMigration
}