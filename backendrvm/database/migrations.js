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
            console.log(`Running migration for ${migration.name} Model...`)
            await doMigration(migration)
            console.log(`Finished migration for ${migration.name} Model.`)
        }
        catch (ex)
        {
            console.log(`There was an error with migration for ${migration.name} model.`, ex)
        }
    }
}

exports = {
    runMigrations()
}