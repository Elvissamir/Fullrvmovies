const app = require('../../../app')
const request = require('supertest')
const mongoose = require('mongoose')
const { Customer } = require('../../../models/Customer')
const { Movie } = require('../../../models/Movie')
const { Genre } = require('../../../models/Genre')
const { Rental } = require('../../../models/Rental')
const { User } = require('../../../models/User')
const { connectToTestingDB, disconnectTestingDB } = require('../../testHelpers')

describe('Route /api/rentals', () => {
    beforeAll(async () => {
        await connectToTestingDB()
    })

    afterAll(async () => {
        await disconnectTestingDB()
    })
    
    describe('GET /', () => {
        
        beforeEach(async () => {
            const customer = new Customer({
                first_name: 'fname',
                last_name: 'lname',
                phone: '02423454534',
                isGold: true
            })

            const movie = new Movie({
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
                genres: [ new Genre({ name: 'genre'}) ]
            })

            const rental = new Rental({
                customer: {
                    id: customer._id,
                    first_name: customer.first_name,
                    last_name: customer.last_name,
                    phone: customer.phone,
                    isGold: customer.isGold
                },
                movie: {
                    id: movie._id,
                    title: movie.title,
                    dailyRentalRate: movie.dailyRentalRate
                },
                dateOut: new Date
            })

            await customer.save()
            await movie.save()
            await rental.save()

            await Rental
        })

        afterEach(async () => {
            await Customer.deleteMany()
            await Movie.deleteMany()
            await Rental.deleteMany()
        })
        
        it('Should return all the rentals', async () => {
            const res = await request(app).get('/api/rentals')

            expect(res.status).toBe(200)
            expect(res.body[0]).toHaveProperty('customer')
            expect(res.body[0]).toHaveProperty('movie')
            expect(res.body[0]).toHaveProperty('dateOut')
        })
    })

    describe('POST /', () => {
        let customer
        let movie
        let token

        beforeEach(async () => {
            token = new User().generateAuthToken()

            customer = new Customer({
                first_name: 'fname',
                last_name: 'lname',
                phone: '02423454534',
                isGold: true
            })

            movie = new Movie({
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
                genres: [ new Genre({ name: 'genre'}) ]
            })

            await customer.save()
            await movie.save()
        })

        afterEach(async () => {
            await Customer.deleteMany()
            await Movie.deleteMany()
            await Rental.deleteMany()
        })

        const sendPostRequest = (data) => {
            return request(app)
                        .post('/api/rentals')
                        .set('x-auth-token', token)
                        .send(data)
        }

        it('Should create a new rental with given data', async () => {
            const data = {
                movieId: movie._id,
                customerId: customer._id
            }

            const countBeforeRequest = await Rental.count()
            expect(countBeforeRequest).toBe(0)

            const res = await sendPostRequest(data)

            const countAfterRequest = await Rental.count()
            expect(countAfterRequest).toBe(1)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('customer')
            expect(res.body).toHaveProperty('movie')
            expect(res.body).toHaveProperty('dateOut')
        })

        it('Should return 401 if the user is not authenticated', async () => {
            const data = {
                movieId: movie._id,
                customerId: customer._id
            }

            const res = await request(app).post('/api/rentals').send(data)
            expect(res.status).toBe(401)
        })

        it('Should return 400 if the movie id is not provided', async () => {
            const data = {
                movieId: movie._id,
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the customer id is not provided', async () => {
            const data = {
                customerId: customer._id
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the movie id is not valid', async () => {
            const data = {
                movieId: '1',
                customerId: customer._id
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the customer id is not valid', async () => {
            const data = {
                movieId: movie._id,
                customerId: '1'
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the movie stock is 0', async () => {
            const data = {
                movieId: movie._id,
                customerId: customer._id
            }

            movie.numberInStock = 0
            await movie.save()

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 404 if the movie does not exist', async () => {
            const data = {
                movieId: mongoose.Types.ObjectId(),
                customerId: customer._id
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(404)
        })

        it('Should return 404 if the customer does not exist', async () => {
            const data = {
                movieId: movie._id,
                customerId: mongoose.Types.ObjectId()
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(404)
        })
    })
})