const request = require('supertest')
const app = require('../../../app')
const { Genre } = require('../../../models/Genre')
const { User } = require('../../../models/User')
const { connectToTestingDB, disconnectTestingDB } = require('../../testHelpers')

describe('Auth middleware', () => {
    let token

    const sendRequest = async () => {
        return await request(app)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: 'genreA' })
    }

    beforeAll(async () => {
        await connectToTestingDB()
    })

    afterAll(async () => {
        await disconnectTestingDB()
    })
    
    beforeEach(async () => {
        token = new User().generateAuthToken()
        await Genre.deleteMany()
    })

    afterEach(async () => await Genre.deleteMany())

    it("Should return 401 if no token is provided", async () => {
        token = ''
        const res = await sendRequest()

        expect(res.status).toBe(401)
    })

    it("Should return 400 if token is invalid", async () => {
        token = 'a'
        const res = await sendRequest()

        expect(res.status).toBe(400)
    })

    it("Should return 200 if token is valid", async () => {
        const res = await sendRequest()

        expect(res.status).toBe(200)
    })
})