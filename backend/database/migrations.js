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

const migrations = [
    { name: 'Genres', model: Genre, data: genres },
]

const doMigration = async ({ model, data, name }) => {
    winston.info(`Running migration for ${name} Model...`)
    await model.collection.insertMany(data)
    winston.info(`Finished migration for ${name} Model.`)
}

const runMigrations = async () => {
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