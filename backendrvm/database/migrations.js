const { Genre } = require('../models/Genre')

const genres = []

const migrations = [
    { name: 'Genres', model: Genre, data: genres },
]

const doMigration = async () => {
    return 
}

const runMigrations = async () => {
    for (const migration of migrations) {
        try {
            await doMigration()
        }
        catch (ex)
        {
            console.log()
        }
    }
}

exports = {
    runMigrations()
}