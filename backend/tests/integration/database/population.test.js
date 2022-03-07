const mongoose = require('mongoose')
const { connectToTestingDB, disconnectTestingDB } = require('../../testHelpers')
const { doMigration } = require('../../../database/migrations')
 
describe('Database Population', () => {
    const mongooseModelSchema = {
        name: {
            type: String,
            required: true,
        }
    }
    const model = mongoose.model('Model', mongooseModelSchema)

    beforeAll(async () => {
        await connectToTestingDB()
        await model.collection.deleteMany()
    })

    afterAll(async () => {
        await disconnectTestingDB()
    })

    it ('Should populate the database using migrations', async () => {
        const data = [{ name: 'A' }, { name: 'B' }]
        const migration = { model, data }

        await doMigration(migration)

        const countAfter = await model.count()
        expect(countAfter).toBe(2)
    })
})