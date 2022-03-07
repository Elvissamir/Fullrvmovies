const winston = require('winston')
const { migrations } = require('../database/migrations') 

if (process.env.APP_ENV === 'testing') {
    winston.add(new winston.transports.Console({
        format: winston.format.printf(log => log.message) }))
}

const doMigration = async ({ model, data, name }) => {
    winston.info(`Running migration for ${name} model...`)
    await model.collection.insertMany(data)
    winston.info(`Finished migration for ${name} model...`)
}

const migrate = async (migrations) => {
    for (const migration of migrations) {
        try {
            await doMigration(migration)
        }
        catch (ex)
        {
            winston.info(`There was an error with migration for ${migration.name} model.`, ex)
            return false
        }
    }
    return true
}

const runMigrations = async () => {
    try {
        const result = await migrate(migrations)
        if (result)
            winston.info('Migrations completed sucessfully')
    }
    catch (ex) {
        winston.error('Something failed with the migration', ex)
    }   
}

module.exports = {
    runMigrations,
    doMigration
}