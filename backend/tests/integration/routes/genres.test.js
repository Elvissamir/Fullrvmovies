const { Genre } = require('../../../models/Genre')
const { User } = require('../../../models/User')
const request = require('supertest')
const app = require('../../../app')
const { random } = require('lodash')
const mongoose = require('mongoose')
const { connectToTestingDB, disconnectTestingDB } = require('../../testHelpers')

describe('Route /api/genres', () => {
    beforeAll(async () => {
        await connectToTestingDB()
    })

    afterAll(async () => {
        await disconnectTestingDB()
    })

    afterEach(async () => {
        await Genre.deleteMany()
    })

    describe('GET /', () => {
        it('Should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: "genreA" },
                { name: 'genreB' }
            ])

            const res = await request(app).get('/api/genres')
            expect(res.body.length).toBe(2)
            expect(res.body.some(g => g.name === 'genreA')).toBeTruthy()
            expect(res.body.some(g => g.name === 'genreB')).toBeTruthy()
            expect(res.statusCode).toBe(200)
        })
    })

    describe('GET /:id', () => {
        it('Should return the right genre if valid id is passed', async () => {
            const genreA = new Genre({ name: 'genreA' }) 
            const genreB = new Genre({ name: "genreB" })
            
            await genreA.save()
            await genreB.save()

            const res = await request(app).get(`/api/genres/${genreA._id}`)
            expect(res.body).toHaveProperty('name', genreA.name)
            expect(res.status).toBe(200)
        })

        it('Should return 404 if no genre with the given id exists', async () => {
            const res = await request(app).get(`/api/genres/${mongoose.Types.ObjectId()}`)
            expect(res.status).toBe(404)
        })

        it('Should return 404 status if the given id is invalid', async () => {
            const res = await request(app).get(`/api/genres/${random(100)}`)
            expect(res.status).toBe(404)
        })
    })

    describe('POST /', () => {
        let token
        let name

        const sendPostRequest = async () => {
            return await request(app)
                            .post('/api/genres/')
                            .set('x-auth-token', token)
                            .send({ name: name })
        }

        beforeEach(() => {
            token = new User().generateAuthToken()
            name = 'GenreA'
        })

        it('Should store the genre and return it', async () => {
            name = new Array(6).join('a')
            
            const res = await sendPostRequest() 
            
            const genre = await Genre.find({ name: name })
            expect(genre).not.toBeNull()
            
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', name)
        })

        it('Should return 401 if client is not logged in', async () => {
            token = ''
            const res = await sendPostRequest()
            expect(res.status).toBe(401)
        })

        it('Should return 400 status if the given name is less than 5 characters', async () => {
            name = '1234'
            const res = await sendPostRequest()
            expect(res.status).toBe(400)
        })

        it('Should return 400 status if the given name has more than 5 characters', async () => {
            name = new Array(52).join('a')
            const res = await sendPostRequest()
            expect(res.status).toBe(400)
        })

        it('Should return 400 status if the name is not provided', async () => {
            name = undefined
            const res = await sendPostRequest()
            expect(res.status).toBe(400)
        })
    })

    describe('PUT /:id', () => {
        let token
        let genre

        beforeEach(async () => {
            genre = new Genre({
                name: 'Genre'
            })

            await genre.save()

            token = new User().generateAuthToken()
        })

        const sendPutRequest = (data) => {
            return request(app)
                        .put(`/api/genres/${genre._id}`)
                        .set('x-auth-token', token)
                        .send(data)
        }

        it('Should update the genre and return it', async () => {
            const data = { name: 'New Name' }
            const res = await sendPutRequest(data) 
            
            const genreInDb = await Genre.findById(genre._id)
            expect(genreInDb.name).toBe('New Name')
            
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', data.name)
        })


        it('Should return 404 if the genre does not exist', async () => {
            await Genre.deleteMany()
            
            const data = { name: 'New Name' }
            const res = await sendPutRequest(data) 
            
            expect(res.status).toBe(404)
        })

        it('Should return 401 if client is not logged in', async () => {
            token = ''
            const data = { name: 'New Name' }

            const res = await sendPutRequest(data)
            expect(res.status).toBe(401)
        })

        it('Should return 400 if the given name is less than 5 characters', async () => {
            const data = { name: 'a' }

            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 404 if the given id is invalid', async () => {
            const data = { name: 'New Name' }

            const res = await request(app)
                                .put('/api/genres/1')
                                .set('x-auth-token', token)
                                .send(data)

            expect(res.status).toBe(404)
        })

        it('Should return 400 if the given name has more than 5 characters', async () => {
            const data = { name: new Array(52).join('a') }

            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the name is not provided', async () => {
            const data = {  } 

            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })
    })

    describe('DELETE /:id', () => {
        let token
        let genre
        let user

        beforeEach(async () => {
            user = new User({
                first_name: "fusername",
                last_name: "lusername",
                phone: "04443455434",
                email: "user@mail.com",
                password: "password",
                isAdmin: true,
            })

            await user.save()
            
            genre = new Genre({
                name: 'Genre'
            })

            await genre.save()
        })

        afterEach(async () => {
            await User.deleteMany()
            await Genre.deleteMany()
        })

        const sendDeleteRequest = () => {
            return request(app)
                        .delete(`/api/genres/${genre._id}`)
                        .set('x-auth-token', token)
        }

        it('Should delete the genre by given id', async () => {
            token = user.generateAuthToken()
            const res = await sendDeleteRequest()

            const genreInDb = await Genre.findById(genre._id)

            expect(genreInDb).toBeNull()

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('name', genre.name)
        })

        it('Should return 401 if the user is not authenticated', async () => {
            token = ''
            const res = await sendDeleteRequest()

            expect(res.status).toBe(401)
        })

        it('Should return 403 if the user is not authorized', async () => {
            user.isAdmin = false
            token = user.generateAuthToken()
            const res = await sendDeleteRequest()

            expect(res.status).toBe(403)
        })

        it('Should return 404 if the given id is invalid', async () => {
            token = user.generateAuthToken()
            const res = await request(app)
                                .delete('/api/genres/1')
                                .set('x-auth-token', token)

            expect(res.status).toBe(404)
        })

        it('Should return 404 if the genre not exist', async () => {
            token = user.generateAuthToken()
            await Genre.findByIdAndDelete(genre._id)

            const res = await sendDeleteRequest()

            expect(res.status).toBe(404)
        })
    })
})