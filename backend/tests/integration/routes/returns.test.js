const app = require('../../../app')
const request = require('supertest')
const { User } = require('../../../models/User')
const { Rental } = require('../../../models/Rental')
const mongoose = require('mongoose')
const moment = require('moment')
const { Movie } = require('../../../models/Movie')
const { connectToTestingDB, disconnectTestingDB } = require('../../testHelpers')

describe('Route /api/returns', () => {
    let token
    let customerId
    let movieId
    let movie
    let rental
    let data

    beforeAll(async () => {
        await connectToTestingDB()
    })

    afterAll(async () => {
        await disconnectTestingDB()
    })

    beforeEach(async () => {
        token = new User().generateAuthToken()
        customerId = mongoose.Types.ObjectId()
        movieId = mongoose.Types.ObjectId()

        movie = new Movie({
            _id: movieId,
            title: 'title',
            dailyRentalRate: 2,
            numberInStock: 100,
            genres: [{ name: 'Genre', _id: mongoose.Types.ObjectId()}]
        })

        await movie.save()

        data = { customerId, movieId }

        rental = new Rental({
            customer: { 
                _id: customerId,
                first_name: 'fname', 
                last_name: 'lname', 
                isGold: true,
                phone: '04242402945'
            },
            movie: {
                _id: movieId,
                title: 'title',
                dailyRentalRate: 2,
                numberInStock: 100,
                genres: [{ name: 'Genre', _id: mongoose.Types.ObjectId()}]
            }
        })

        await rental.save()
    })

    afterEach(async () => {
        await Movie.deleteMany()
        await Rental.deleteMany()
    })

    const sendPostRequest = () => {
        return request(app)
                        .post('/api/returns')
                        .set('x-auth-token', token)
                        .send(data)
    }

    it('Should return 200 and if valid request', async () => {
        const res = await sendPostRequest()
        expect(res.status).toBe(200)
    })

    it('Should set the return date', async () => {
        await sendPostRequest()
        
        rentalInDB = await Rental.findById(rental._id)
        const diff = new Date() - rentalInDB.dateReturned
        expect(diff).toBeLessThan(10 * 1000)
    })

    it('Should calculate the rental fee', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate()
        await rental.save()

        await sendPostRequest()

        const rentalInDB = await Rental.findById(rental._id)
        expect(rentalInDB.rentalFee).toBe(14)
    })

    it('Should increase the movie stock', async () => {
        await sendPostRequest()

        const movieInDB = await Movie.findById(movieId)

        expect(movieInDB.numberInStock).toBe(101)
    })

    it('Should return the rental in the response', async () => {
        const res = await sendPostRequest()

        expect(Object.keys(res.body))
            .toEqual(expect.arrayContaining([
                'dateOut', 
                'dateReturned', 
                'rentalFee', 
                'customer',
                'movie'
            ]))
    })

    it('Should return 401 if client is not logged in', async () => {
        token = ''

        const res = await sendPostRequest()
        expect(res.status).toBe(401)
    })

    it('Should return 400 if customer id is not provided', async () => {
        data.customerId = ''

        const res = await sendPostRequest()
        expect(res.status).toBe(400)
    })

    it('Should return 400 if movie id is not provided', async () => {
        data.movieId = ''

        const res = await sendPostRequest()
        expect(res.status).toBe(400)
    })

    it('Should return 400 if customer id is invalid', async () => {
        data.customerId = 1

        const res = await sendPostRequest()
        expect(res.status).toBe(400)
    })

    it('Should return 400 if movie id is invalid', async () => {
        data.movieId = 1

        const res = await sendPostRequest()
        expect(res.status).toBe(400)
    })

    it('Should return 404 if no rental found for this customer/movie', async () => {
        await Rental.findByIdAndDelete(rental._id)

        const res = await sendPostRequest()
        expect(res.status).toBe(404)
    })

    it('Should return 400 if return already processed', async () => {
        rental.dateReturned = new Date()
        await rental.save()

        const res = await sendPostRequest()
        expect(res.status).toBe(400)
    })
})