const mongoose = require('mongoose')
const { connectToTestingDB, disconnectTestingDB } = require('../../testHelpers')
const { doMigration } = require('../../../database/migrationsHandler')
 
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
    })

    afterAll(async () => {
        await disconnectTestingDB()
    })

    afterEach(async () => {
        await model.collection.deleteMany()
    })

    it ('Should populate the database using migrations', async () => {
        const data = [{ name: 'A' }, { name: 'B' }]
        const migration = { model, data, name: 'Model' }

        await doMigration(migration)

        const countAfter = await model.count()
        expect(countAfter).toBe(2)
    })

    it('Should delete all documents in the collection before each migration', async () => {
        const initialData = [{ name: 'A' }, { name: 'B'}, {name: 'C'}]
        await model.collection.insertMany(initialData)

        const countBefore = await model.count()
        expect(countBefore).toBe(3)

        const data = [{ name: "New" }]
        const migration = { model, data, name: 'Model' }

        await doMigration(migration)

        const newDocuments = await model.find()
        expect(newDocuments.length).toBe(1)
        expect(newDocuments[0].name).toBe('New')
    })
})