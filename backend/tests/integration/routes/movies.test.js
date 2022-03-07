const app = require('../../../app')
const request = require('supertest')
const mongoose = require('mongoose')
const { Movie } = require('../../../models/Movie')
const { Genre } = require('../../../models/Genre')
const { User } = require('../../../models/User')
const { connectToTestingDB, disconnectTestingDB } = require('../../testHelpers')

describe('Route /api/movies', () => {
    beforeAll(async () => {
        await connectToTestingDB()
    })

    afterAll(async () => {
        await disconnectTestingDB()
    })

    describe('GET /', () => {
        afterEach(async () => {
            await Genre.deleteMany()
            await Movie.deleteMany()
        })

        const sendGetRequest = () => {
            return request(app).get('/api/movies')
        }

        it('Should return the list of movies', async () => {
            const genreA = new Genre({
                name: 'Genre A'
            })

            const movieA = new Movie({ 
                title: 'movie A', 
                numberInStock: 5,
                dailyRentalRate: 1,
                genres: [genreA]
            })

            const movieB = new Movie({ 
                title: 'movie B', 
                numberInStock: 5,
                dailyRentalRate: 1,
                genres: [genreA]
            })

            await genreA.save()
            await movieA.save()
            await movieB.save()

            const res = await sendGetRequest()

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(res.body[0]).toHaveProperty('title', 'movie A')
            expect(res.body[1]).toHaveProperty('title', 'movie B')
        })
    })

    describe('GET /:id', () => {
        afterEach(async () => {
            await Genre.deleteMany()
            await Movie.deleteMany()
        })

        it('Should return the movie by given id', async () => {
            const genreA = new Genre({
                name: 'Genre A'
            })

            const movieA = new Movie({ 
                title: 'movie A', 
                numberInStock: 5,
                dailyRentalRate: 1,
                genres: [genreA]
            })

            await genreA.save()
            await movieA.save()

            const res = await request(app).get(`/api/movies/${movieA._id}`)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('title', 'movie A')
        })

        it('Should return 404 if invalid id is given', async () => {
            const res = await request(app).get('/api/movies/1')

            expect(res.status).toBe(404)
        })

        it('Should return 404 if the movie does not exist', async () => {
            const randomDocumentId = mongoose.Types.ObjectId()

            const res = await request(app).get(`/api/movies/${randomDocumentId}`)

            expect(res.status).toBe(404)
        })
    })

    describe('POST /', () => {
        let token

        beforeEach(async () => {
            token = new User().generateAuthToken()
        })

        afterEach(async () => {
            await Movie.deleteMany()
            await Genre.deleteMany()
        })

        const sendPostRequest = (data) => {
            return request(app)
                        .post('/api/movies')
                        .set('x-auth-token', token)
                        .send(data)
        }

        it('Should create a new movie with the given data', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()

            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [ genre._id ]
            }
            
            const res = await sendPostRequest(data)

            const movieInDb = await Movie.findOne({ title: 'the movie' })
            expect(movieInDb).toHaveProperty('title', data.title)
            expect(movieInDb).toHaveProperty('genres')
            expect(movieInDb).toHaveProperty('dailyRentalRate', data.dailyRentalRate)
            expect(movieInDb).toHaveProperty('numberInStock', data.numberInStock)
            
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('title', data.title)
            expect(res.body).toHaveProperty('genres')
            expect(res.body).toHaveProperty('dailyRentalRate', data.dailyRentalRate)
            expect(res.body).toHaveProperty('numberInStock', data.numberInStock)
        })

        it('Should return 400 if title is not provided', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()

            const data = {
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [ genre._id ]
            }
            
            const res = await sendPostRequest(data)

            expect(res.status).toBe(400)
        })

        it('Should return 400 if title has less than 2 letters', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()
            
            const data = {
                title: 'a',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [ genre._id ]
            }
            
            const res = await sendPostRequest(data)

            expect(res.status).toBe(400)
        })

        it('Should return 401 if the user is not authenticated', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()
            
            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [ genre._id ]
            }
            
            const res = await request(app)
                                .post('/api/movies')
                                .send(data)

            expect(res.status).toBe(401) 
        })

        it('Should return 400 if title has more than 255 letters', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()
            
            const data = {
                title: new Array(257).join('a'),
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [ genre._id ]
            }
            
            const res = await sendPostRequest(data)

            expect(res.status).toBe(400)
        })

        it('Should return 400 if title is not a string', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()
            
            const data = {
                title: 1234,
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [ genre._id ]
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if genreIds is not provided', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()

            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if genreIds is not an array', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()

            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: "notAnArray"
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if genreIds does not have at least one item', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()

            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: []
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the provided genre ids are not valid', async () => {
            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: ['1']
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if numberInStock is not provided', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()

            const data = {
                title: 'the movie',
                dailyRentalRate: 1,
                genreIds: [genre._id]
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the numberInStock is less than 0', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()
            
            const data = {
                title: 'the movie',
                numberInStock: -1,
                dailyRentalRate: 1,
                genreIds: [genre._id]
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the numberInStock is more than 255', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()
            
            const data = {
                title: 'the movie',
                numberInStock: 256,
                dailyRentalRate: 1,
                genreIds: [genre._id]
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the numberInStock is not a number', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()
            
            const data = {
                title: 'the movie',
                numberInStock: 'notANumber',
                dailyRentalRate: 1,
                genreIds: [genre._id]
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the dailyRentalRate is not a number', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()
            
            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 'notANumber',
                genreIds: [genre._id]
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the dailyRentalRate is not provided', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()
            
            const data = {
                title: 'the movie',
                numberInStock: 5,
                genreIds: [genre._id]
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the dailyRentalRate is less than 0', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()
            
            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: -1,
                genreIds: [genre._id]
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the dailyRentalRate is more than 255', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()
            
            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 256,
                genreIds: [genre._id]
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 404 if an invalid genre id is provided', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()

            const randomGenreId = mongoose.Types.ObjectId()
            
            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [genre._id, randomGenreId]
            }
            
            const res = await sendPostRequest(data) 
            expect(res.status).toBe(404) 
        })
    })

    describe('PUT /:id', () => {
        let movie
        let genre
        let token

        beforeEach(async () => {
            token = new User().generateAuthToken()

            genre = new Genre({ name: "genre" })
            await genre.save()
            
            movie = new Movie( {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
                genres: [ genre ]
            })

            await movie.save()
        })

        afterEach(async () => {
            await Movie.deleteMany()
            await Genre.deleteMany()
        })

        const sendPutRequest = (data) => {
            return request(app)
                        .put(`/api/movies/${movie._id}`)
                        .set('x-auth-token', token)
                        .send(data)
        }

        it('Should update movie with the given data', async () => {
            const data = {
                title: 'new title',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [ genre._id ]
            }
            
            const res = await sendPutRequest(data)
            expect(res.status).toBe(200)

            const movieInDb = await Movie.findOne({ title: data.title })
            expect(movieInDb).toHaveProperty('title', data.title)
            expect(movieInDb).toHaveProperty('genres')
            expect(movieInDb).toHaveProperty('dailyRentalRate', data.dailyRentalRate)
            expect(movieInDb).toHaveProperty('numberInStock', data.numberInStock)
            
            expect(res.body).toHaveProperty('title', data.title)
            expect(res.body).toHaveProperty('genres')
            expect(res.body).toHaveProperty('dailyRentalRate', data.dailyRentalRate)
            expect(res.body).toHaveProperty('numberInStock', data.numberInStock)
        })

        it('Should return 401 if the user is not authenticated', async () => {
            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [ genre._id ]
            }
            
            const res = await  request(app)
                                    .put(`/api/movies/${movie._id}`)
                                    .send(data)
            expect(res.status).toBe(401) 
        })

        it('Should return 400 if the given movie id is invalid', async () => {
            const data = {
                title: 'new title',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [ genre._id ]
            }
            
            const res = await request(app)
                                .put('/api/movies/1')
                                .set('x-auth-token', token)
                                .send(data)
            
            expect(res.status).toBe(404)
        })

        it('Should return 404 if the movie does not exist', async () => {
            const data = {
                title: 'new title',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [ genre._id ]
            }
            
            const res = await request(app)
                                .put(`/api/movies/${mongoose.Types.ObjectId()}`)
                                .set('x-auth-token', token)
                                .send(data)
            
            expect(res.status).toBe(404)
        })

        it('Should return 404 if any of the given genre ids is invalid', async () => {
            const data = {
                title: 'new title',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [ genre._id, '1' ]
            }
            
            const res = await sendPutRequest(data)
            
            expect(res.status).toBe(400)
        })

        it('Should return 404 if any of the given genre ids does not exist', async () => {
            const data = {
                title: 'new title',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [ genre._id, mongoose.Types.ObjectId() ]
            }

            const res = await sendPutRequest(data)
            
            expect(res.status).toBe(404)
        })

        it('Should return 400 if title has less than 2 letters', async () => {
            const data = {
                title: 'a',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [ genre._id ]
            }
            
            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if title has more than 255 letters', async () => {
            const data = {
                title: new Array(257).join('a'),
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [ genre._id ]
            }
            
            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if title is not a string', async () => {
            const data = {
                title: 1234,
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [ genre._id ]
            }
            
            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if genreIds is not provided', async () => {
            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
            }
            
            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if genreIds is not an array', async () => {
            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: "notAnArray"
            }
            
            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if genreIds does not have at least one item', async () => {
            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: []
            }
            
            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if numberInStock is not provided', async () => {
            const data = {
                title: 'the movie',
                dailyRentalRate: 1,
                genreIds: [genre._id]
            }
            
            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the numberInStock is less than 0', async () => {
            const data = {
                title: 'the movie',
                numberInStock: -1,
                dailyRentalRate: 1,
                genreIds: [genre._id]
            }
            
            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the numberInStock is more than 255', async () => {
            const data = {
                title: 'the movie',
                numberInStock: 256,
                dailyRentalRate: 1,
                genreIds: [genre._id]
            }
            
            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the numberInStock is not a number', async () => {
            const data = {
                title: 'the movie',
                numberInStock: 'notANumber',
                dailyRentalRate: 1,
                genreIds: [genre._id]
            }
            
            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the dailyRentalRate is not a number', async () => {
            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 'notANumber',
                genreIds: [genre._id]
            }
            
            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the dailyRentalRate is not provided', async () => {
            const data = {
                title: 'the movie',
                numberInStock: 5,
                genreIds: [genre._id]
            }
            
            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the dailyRentalRate is less than 0', async () => {
            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: -1,
                genreIds: [genre._id]
            }
            
            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the dailyRentalRate is more than 255', async () => {
            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 256,
                genreIds: [genre._id]
            }
            
            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })
    })

    describe('DELETE /:id', () => {
        let movie
        let genre
        let token

        beforeEach(async () => {
            token = new User({
                first_name: 'fname',
                last_name: 'lname',
                password: User.hashPassword('password'),
                email: 'user@mail.com',
                isAdmin: true
            }).generateAuthToken()

            genre = new Genre({ name: "genre" })
            await genre.save()
            
            movie = new Movie( {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
                genres: [ genre ]
            })

            await movie.save()
        })

        afterEach(async () => {
            await Movie.deleteMany()
            await Genre.deleteMany()
        })

        const sendDeleteRequest = () => {
            return request(app)
                        .delete(`/api/movies/${movie._id}`)
                        .set('x-auth-token', token)
        }

        it('Should delete the movie by given id', async () => {
            const countBeforeRequest = await Movie.count()
            expect(countBeforeRequest).toBe(1)

            const res = await sendDeleteRequest()

            const countAfterRequest = await Movie.count()
            expect(countAfterRequest).toBe(0)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('title', movie.title)
        })

        it('Should return 401 if the user is not authenticated', async () => {
            const countBeforeRequest = await Movie.count()
            expect(countBeforeRequest).toBe(1)

            const res = await request(app).delete(`/api/movies/${movie._id}`)

            const countAfterRequest = await Movie.count()
            expect(countAfterRequest).toBe(1)

            expect(res.status).toBe(401)
        })

        it('Should return 403 if the user is not authorized', async () => {
            token = new User({
                first_name: 'fname',
                last_name: 'lname',
                password: User.hashPassword('password'),
                email: 'user@mail.com',
                isAdmin: false
            }).generateAuthToken()
            
            const res = await request(app).delete(`/api/movies/${movie._id}`).set('x-auth-token', token)
            
            expect(res.status).toBe(403)
        })

        it('Should return 404 if invalid movie id is given', async () => {
            const res = await request(app).delete('/api/movies/1').set('x-auth-token', token)
            expect(res.status).toBe(404)
        })

        it('Should return 404 the movie does not exist', async () => {
            const randomMovieId = mongoose.Types.ObjectId()
            const res = await request(app)
                                .delete(`/api/movies/${randomMovieId}`)
                                .set('x-auth-token', token)
            expect(res.status).toBe(404)
        })
    })
})