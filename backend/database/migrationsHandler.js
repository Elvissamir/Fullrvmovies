const logger = require('../startup/logger')
const { migrations } = require('../database/migrations') 

const doMigration = async ({ model, data, name }) => {
    logger.info(`Running migration for ${name} model...`)
    await model.collection.insertMany(data)
    logger.info(`Finished migration for ${name} model...`)
}

const migrate = async (migrations) => {
    for (const migration of migrations) {
        try {
            await doMigration(migration)
        }
        catch (ex)
        {
            logger.info(`There was an error with migration for ${migration.name} model.`, ex)
            return false
        }
    }
    return true
}

const runMigrations = async () => {
    try {
        const result = await migrate(migrations)
        if (result)
            logger.info('Migrations completed sucessfully')
    }
    catch (ex) {
        logger.error('Something failed with the migration', ex)
    }   
}

module.exports = {
    runMigrations,
    doMigration
}