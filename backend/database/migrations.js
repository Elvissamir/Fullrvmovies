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

const doMigration = async ({ model, data }) => {
    await model.collection.insertMany(data)
}

const runMigrations = async () => {
    for (const migration of migrations) {
        try {
            winston.info(`Running migration for ${migration.name} Model...`)
            await doMigration(migration)
            winston.info(`Finished migration for ${migration.name} Model.`)
        }
        catch (ex)
        {
            winston.info(`There was an error with migration for ${migration.name} model.`, ex)
            winston.info()
        }
    }
}

exports = {
    runMigrations
}