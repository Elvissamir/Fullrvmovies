const app = require('../../../app')
const request = require('supertest')
const { User } = require('../../../models/User')

describe('Route POST /api/login', () => {

    afterEach(async () => {
        await User.deleteMany()
    })

    const sendPostRequest = (data) => {
        return request(app).post('/api/login').send(data)
    }

    it('Should send the auth token for the user', async () => {
        const password = 'password'
        const user = new User({
            first_name: 'fname',
            last_name: 'lname',
            email: 'user@mail.com',
            password: await User.hashPassword(password),
            isAdmin: false
        })

        await user.save()

        const data = {
            email: user.email,
            password: password
        }

        const res = await sendPostRequest(data)

        expect(res.status).toBe(200)
        expect(res.text).toBe(user.generateAuthToken())
    })

    it('Should return 400 if the password is invalid', async () => {
        const password = 'password'
        const user = new User({
            first_name: 'fname',
            last_name: 'lname',
            email: 'user@mail.com',
            password: await User.hashPassword(password),
            isAdmin: false
        })

        await user.save()

        const data = {
            email: user.email,
            password: 'notTheRightPassword'
        }

        const res = await sendPostRequest(data)

        expect(res.status).toBe(400)
    })

    it('Should return 400 if the user does not exist', async () => {
        const data = {
            email: 'user@mail.com',
            password: 'password'
        }
        
        const res = await sendPostRequest(data)

        expect(res.status).toBe(400)
    })

    it('Should return 400 if the email is not provided', async () => {
        const data = {
            password: 'password'
        }

        const res = await sendPostRequest(data)
        expect(res.status).toBe(400)
    })

    it('Should return 400 if the email has less than 10 characters', async () => {
        const data = {
            email: 'a',
            password: 'password'
        }

        const res = await sendPostRequest(data)
        expect(res.status).toBe(400)
    })

    it('Should return 400 if the email has more than 1024 characters', async () => {
        const data = {
            email: new Array(257).join('a'),
            password: 'password'
        }

        const res = await sendPostRequest(data)
        expect(res.status).toBe(400)
    })

    it('Should return 400 if the provided email is not valid', async () => {
        const data = {
            email: 'notAnEmail',
            password: 'password'
        }

        const res = await sendPostRequest(data)
        expect(res.status).toBe(400)
    })

    it('Should return 400 if the provided email is not a string', async () => {
        const data = {
            email: 12345,
            password: 'password'
        }

        const res = await sendPostRequest(data)
        expect(res.status).toBe(400)
    })

    it('Should return 400 if the password is not provided', async () => {
        const data = {
            email: 'user@mail.com',
        }

        const res = await sendPostRequest(data)
        expect(res.status).toBe(400)
    })

    it('Should return 400 if the password has less than 6 characters', async () => {
        const data = {
            email: 'user@mail.com',
            password: new Array(5).join('a')
        }

        const res = await sendPostRequest(data)
        expect(res.status).toBe(400)
    })

    it('Should return 400 if the password has more than 1024 characters', async () => {
        const data = {
            email: 'user@mail.com',
            password: new Array(1026).join('a')
        }

        const res = await sendPostRequest(data)
        expect(res.status).toBe(400)
    })

    it('Should return 400 if the password is not a string', async () => {
        const data = {
            email: 'user@mail.com',
            password: 12345
        }

        const res = await sendPostRequest(data)
        expect(res.status).toBe(400)
    })

})