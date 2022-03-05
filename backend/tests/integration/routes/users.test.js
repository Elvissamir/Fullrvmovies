const app = require('../../../app')
const request = require("supertest")
const bcrypt = require("bcrypt")
const { User } = require('../../../models/User')

describe('Route /api/users', () => {
    describe('GET /', () => {
        let token
        
        beforeEach(async () => {
            await User.collection.insertMany([
                {
                    first_name: "fnameA",
                    last_name: "lnameA",
                    phone: "04443455434",
                    email: "userA@mail.com",
                    password: "password",
                    isAdmin: false,
                },
                {
                    first_name: "fnameB",
                    last_name: "lnameB",
                    phone: "04443455434",
                    email: "userB@mail.com",
                    password: "password",
                    isAdmin: false,
                }
            ])

            token = new User().generateAuthToken()
        })

        afterEach(async () => {
            await User.deleteMany()
        })

        const sendGetRequest = () => {
            return request(app).get('/api/users').set('x-auth-token', token)
        }

        it('Should return all the users', async () => {
            const res = await sendGetRequest()

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(Object.keys(res.body[0]))
            .toEqual(expect.arrayContaining([
                'first_name', 
                'last_name',
                'email',
                'phone',
                'isAdmin'
            ]))
        })

        it('Should return 401 if the user is not authorized', async () => {
            token = ''
            const res = await sendGetRequest()

            expect(res.status).toBe(401)
        })
    })

    describe('GET /me', () => {
        afterEach(async () => {
            await User.deleteMany()
        })

        it('Should return the authenticated users data without password', async () => {
            const user = new User({
                first_name: 'fname',
                last_name: 'lname',
                email: 'user@mail.com',
                password: 'password',
                isAdmin: false
            })

            await user.save()

            const token = user.generateAuthToken() 

            const res = await request(app).get('/api/users/me').set('x-auth-token', token)

            expect(res.body).toHaveProperty('first_name', user.first_name)
            expect(res.body).toHaveProperty('last_name', user.last_name)
            expect(res.body).toHaveProperty('email', user.email)
            expect(res.body).toHaveProperty('isAdmin', user.isAdmin)
            expect(res.body).not.toHaveProperty('password')
        })

        it('Should return 401 if not authenticated', async () => {
            const res = await request(app).get('/api/users/me')

            expect(res.status).toBe(401)
        })
    })
    
    describe('POST /', () => {
        const sendPostRequest = (data) => {
            return request(app).post('/api/users').send(data)
        } 
        
        afterEach(async () => {
            await User.deleteMany()
        })

        it('Should create a new user with given data', async () => {
            const countBeforeRequest = await User.countDocuments()
            expect(countBeforeRequest).toBe(0)

            const data = {
                first_name: 'fname',
                last_name: 'lname',
                email: 'newuser@mail.com',
                password: 'password',
            }

            const res = await sendPostRequest(data)

            const countAfterRequest = await User.countDocuments()
            expect(countAfterRequest).toBe(1)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('first_name', data.first_name)
            expect(res.body).toHaveProperty('last_name', data.last_name)
            expect(res.body).toHaveProperty('email', data.email)
        })

        it('Should hash the users password', async () => {
            const data = {
                first_name: 'fname',
                last_name: 'lname',
                email: 'newuser@mail.com',
                password: 'password',
            }

            await sendPostRequest(data)

            const userInDb = await User.findOne({ email: data.email })

            const comparisonResult = await bcrypt.compare(data.password, userInDb.password)
            expect(comparisonResult).toBe(true)
        })

        it("Should add the auth token to the response headers", async () => {
            const data = {
                first_name: 'fname',
                last_name: 'lname',
                email: 'newuser@mail.com',
                password: 'password',
            }

            const res = await sendPostRequest(data)
            expect(res.headers).toHaveProperty('x-auth-token')
        })

        it('Should return 400 if email is already in use', async () => {
            await new User({
                first_name: 'userA',
                last_name: 'userB',
                email: 'user@mail.com',
                password: 'password',
            }).save()

            const data = {
                first_name: 'userB',
                last_name: 'userB',
                email: 'user@mail.com',
                password: 'password',
            }

            const res = await sendPostRequest(data)

            expect(res.status).toBe(400)
        })

        it('Should return 400 if the first name is not provided', async () => {
            const data = {
                last_name: 'lname',
                email: 'newuser@mail.com',
                password: 'password',
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the first name has less than 2 letters', async () => {
            const data = {
                first_name: 'a',
                last_name: 'lname',
                email: 'newuser@mail.com',
                password: 'password',
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the first name has more than 15 letters', async () => {
            const data = {
                first_name: 'abcdefghijklmnop',
                last_name: 'lname',
                email: 'newuser@mail.com',
                password: 'password',
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the first name does not have only letters', async () => {
            const data = {
                first_name: 'strWithNumber1',
                last_name: 'lname',
                email: 'newuser@mail.com',
                password: 'password',
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the last name is not provided', async () => {
            const data = {
                first_name: 'fname',
                email: 'newuser@mail.com',
                password: 'password',
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the last name has less than 2 letters', async () => {
            const data = {
                first_name: 'fname',
                last_name: 'a',
                email: 'newuser@mail.com',
                password: 'password',
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the last name has more than 15 letters', async () => {
            const data = {
                first_name: 'fname',
                last_name: 'abcdefghijklmnop',
                email: 'newuser@mail.com',
                password: 'password',
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the last name does not have only letters', async () => {
            const data = {
                first_name: 'fname',
                last_name: 'strWithNumber1',
                email: 'newuser@mail.com',
                password: 'password',
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the email is not provided', async () => {
            const data = {
                first_name: 'fname',
                last_name: 'lname',
                password: 'password',
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if a invalid email is provided', async () => {
            const data = {
                email: 'notAnEmail',
                first_name: 'fname',
                last_name: 'lname',
                password: 'password',
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if a password is not provided', async () => {
            const data = {
                email: 'user@mail.com',
                first_name: 'fname',
                last_name: 'lname',
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the password has less than 6 letters', async () => {
            const data = {
                email: 'user@mail.com',
                first_name: 'fname',
                last_name: 'lname',
                password: 'a'
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the password has more than 1024 letters', async () => {
            const data = {
                email: 'user@mail.com',
                first_name: 'fname',
                last_name: 'lname',
                password: new Array(1026).join('a')
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })
    })
})