const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../../../app')
const { Customer } = require("../../../models/Customer")
const { User } = require('../../../models/User')

describe('Route /api/customers', () => {
    afterEach(async () => {
        await Customer.deleteMany()
    })
    
    describe('GET /', () => {
        it('Should return all customers', async () => {
            const customerA =  {
                isGold: true,
                first_name: 'fnameA',
                last_name: 'lnameA',
                phone: "04242403945"
            } 
    
            const customerB =  {
                isGold: true,
                first_name: 'fnameA',
                last_name: 'lnameA',
                phone: "04242403945"
            }
    
            await Customer.collection.insertMany([
                customerA,
                customerB
            ])

            const res = await request(app).get('/api/customers')
            
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(Object.keys(res.body[0]))
                .toEqual(expect.arrayContaining([
                    'first_name', 
                    'last_name',
                    'phone',
                    'isGold'
                ]))
        })
    })

    describe('GET /:id', () => {
        it('Should return the customer by given id', async () => {
            const customerC = new Customer({
                isGold: true,
                first_name: 'fnameA',
                last_name: 'lnameA',
                phone: "04242403945"
            })

            await customerC.save()

            const res = await request(app).get(`/api/customers/${customerC._id}`)
            
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('first_name', customerC.first_name)
            expect(res.body).toHaveProperty('last_name', customerC.last_name)
            expect(res.body).toHaveProperty('phone', customerC.phone)
            expect(res.body).toHaveProperty('isGold', customerC.isGold)
        })

        it('Should return 404 if the customer does not exist', async () => {
            const randomId = mongoose.Types.ObjectId()

            const res = await request(app).get(`/api/customers/${randomId}`)
            expect(res.status).toBe(404)
        })

        it('Should return 404 if the given id is invalid', async () => {
            const invalidId = 1

            const res = await request(app).get(`/api/customers/${invalidId}`)
            expect(res.status).toBe(404)
        })
    })

    describe('POST /', () => {
        let token 

        beforeEach(() => {
            token = new User().generateAuthToken()
        })

        const sendPostRequest = (data) => {
            return request(app)
                .post('/api/customers')
                .set('x-auth-token', token)
                .send(data)
        }

        it('Should create and store a new customer with given data', async () => {
            const data = {
                isGold: true,
                first_name: 'cfname',
                last_name: 'clanme',
                phone: "55555555545"
            }
            
            const res = await sendPostRequest(data)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('first_name', data.first_name)
            expect(res.body).toHaveProperty('last_name', data.last_name)
            expect(res.body).toHaveProperty('phone', data.phone)
            expect(res.body).toHaveProperty('isGold', data.isGold)
        })

        it('Should return 401 if the user is not logged in', async () => {
            token = ''
            const data = {
                isGold: true,
                first_name: 'cfname',
                last_name: 'clanme',
                phone: "55555555545"
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(401)
        })

        it('Should return 400 if first_name is not provided', async () => {
            const data = {
                isGold: true,
                last_name: 'clanme',
                phone: "55555555545"
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if first_name has less than 2 letters', async () => {
            const data = {
                isGold: true,
                first_name: 'a',
                last_name: 'clanme',
                phone: "55555555545"
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if first_name has more than 15 letters', async () => {
            const data = {
                isGold: true,
                first_name: 'abcdefghijklmnopqrs',
                last_name: 'clanme',
                phone: "55555555545"
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if last_name is not provided', async () => {
            data = {
                isGold: true,
                first_name: 'cfname',
                phone: "55555555545"
            }

            const res = await sendPostRequest()
            expect(res.status).toBe(400)
        })

        it('Should return 400 if last_name has less than 2 letters', async () => {
            data = {
                isGold: true,
                first_name: 'cfname',
                last_name: 'a',
                phone: "55555555545"
            }
            const res = await sendPostRequest()
            expect(res.status).toBe(400)
        })

        it('Should return 400 if last_name has more than 15 letters', async () => {
            const data = {
                isGold: true,
                first_name: 'cfname',
                last_name: 'abcdefghijklmnopqrs',
                phone: "55555555545"
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if isGold property is not provided', async () => {
            const data = {
                first_name: 'cfname',
                last_name: 'clname',
                phone: "55555555545"
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if isGold is not a boolean', async () => {
            const data = {
                isGold: 'notBoolean',
                first_name: 'cfname',
                last_name: 'clanme',
                phone: "55555555545"
            }
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if phone is not provided', async () => {
            const data = {
                isGold: true,
                first_name: 'cfname',
                last_name: 'clname',
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if last_name has less than 11 numbers', async () => {
            const data = {
                isGold: true,
                first_name: 'cfname',
                last_name: 'clanme',
                phone: "1"
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if phone has more than 11 numbers', async () => {
            const data = {
                isGold: true,
                first_name: 'cfname',
                last_name: 'clanme',
                phone: "'01234567891011213'"
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })
    })

    describe('PUT /:id', () => {
        let token 
        let customer

        beforeEach(async () => {
            token = new User().generateAuthToken()
            customer =  new Customer({
                isGold: true,
                first_name: 'fname',
                last_name: 'lname',
                phone: "04242224554"
            })

            await customer.save()
        })

        const sendPutRequest = (data) => {
            return request(app)
                .put(`/api/customers/${customer._id}`)
                .set('x-auth-token', token)
                .send(data)
        }

        it('Should update a customer with given data and return the customer', async () => {
            const data = {
                isGold: false,
                first_name: 'newfname',
                last_name: 'newlname',
                phone: "12302402945"
            }
            
            const res = await sendPutRequest(data)

            const customerInDb = await Customer.findById(customer._id)

            expect(customerInDb).toHaveProperty('first_name', data.first_name)
            expect(customerInDb).toHaveProperty('last_name', data.last_name)
            expect(customerInDb).toHaveProperty('phone', data.phone)
            expect(customerInDb).toHaveProperty('isGold', data.isGold)
            
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('first_name', data.first_name)
            expect(res.body).toHaveProperty('last_name', data.last_name)
            expect(res.body).toHaveProperty('phone', data.phone)
            expect(res.body).toHaveProperty('isGold', data.isGold)
        })

        it('Shoult return 404 if the customer does not exist', async () => {
            const data = {
                isGold: false,
                first_name: 'newfname',
                last_name: 'newlname',
                phone: "12302402945"
            }

            await Customer.deleteMany()            
            const res = await sendPutRequest(data)
            
            expect(res.status).toBe(404)
        })

        it('Should return 401 if the user is not logged in', async () => {
            token = ''
            const data = {
                isGold: true,
                first_name: 'cfname',
                last_name: 'clanme',
                phone: "55555555545"
            }

            const res = await sendPutRequest(data)
            expect(res.status).toBe(401)
        })
        
        it('Should return 404 if the given id is invalid', async () => {
            const data = {
                isGold: true,
                first_name: 'cfname',
                last_name: 'clanme',
                phone: "55555555545"
            }

            const res = await request(app)
                                .put('/api/customers/1')
                                .set('x-auth-token', token)
                                .send(data)

            expect(res.status).toBe(404)
        })

        it('Should return 400 if first_name is not provided', async () => {
            const data = {
                isGold: true,
                last_name: 'clanme',
                phone: "55555555545"
            }

            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if first_name has less than 2 letters', async () => {
            const data = {
                isGold: true,
                first_name: 'a',
                last_name: 'clanme',
                phone: "55555555545"
            }

            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if first_name has more than 15 letters', async () => {
            const data = {
                isGold: true,
                first_name: 'abcdefghijklmnopqrs',
                last_name: 'clanme',
                phone: "55555555545"
            }

            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if last_name is not provided', async () => {
            const data = {
                isGold: true,
                first_name: 'cfname',
                phone: "55555555545"
            }

            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if last_name has less than 2 letters', async () => {
            const data = {
                isGold: true,
                first_name: 'cfname',
                last_name: 'a',
                phone: "55555555545"
            }
            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if last_name has more than 15 letters', async () => {
            const data = {
                isGold: true,
                first_name: 'cfname',
                last_name: 'abcdefghijklmnopqrs',
                phone: "55555555545"
            }

            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if isGold property is not provided', async () => {
            const data = {
                first_name: 'cfname',
                last_name: 'clname',
                phone: "55555555545"
            }

            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if isGold is not a boolean', async () => {
            const data = {
                isGold: 'notBoolean',
                first_name: 'cfname',
                last_name: 'clanme',
                phone: "55555555545"
            }
            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if phone is not provided', async () => {
            const data = {
                isGold: true,
                first_name: 'cfname',
                last_name: 'clname',
            }

            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if last_name has less than 11 numbers', async () => {
            const data = {
                isGold: true,
                first_name: 'cfname',
                last_name: 'clanme',
                phone: "1"
            }

            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if phone has more than 11 numbers', async () => {
            const data = {
                isGold: true,
                first_name: 'cfname',
                last_name: 'clanme',
                phone: "'01234567891011213'"
            }

            const res = await sendPutRequest(data)
            expect(res.status).toBe(400)
        })
    })

    describe('DELETE /:id', () => {
        let token 
        let customer
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

            customer =  new Customer({
                isGold: true,
                first_name: 'fname',
                last_name: 'lname',
                phone: "04242224554"
            })

            await customer.save()
        })

        afterEach(async () => {
            await User.deleteMany()
            await Customer.deleteMany()
        })

        const sendDeleteRequest = () => {
            return request(app)
                .delete(`/api/customers/${customer._id}`)
                .set('x-auth-token', token)
        }

        it('Should delete a customer by given id', async () => {
            token = user.generateAuthToken()
            const res = await sendDeleteRequest()

            const deletedCustomer = await Customer.findById(customer._id)
            expect(deletedCustomer).toBe(null)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('first_name', customer.first_name)
            expect(res.body).toHaveProperty('last_name', customer.last_name)
            expect(res.body).toHaveProperty('phone', customer.phone)
            expect(res.body).toHaveProperty('isGold', customer.isGold)
        })

        it('Should return 404 if the given id is invalid', async () => {
            token = user.generateAuthToken()
            const res = await request(app)
                                .delete('/api/customers/1')
                                .set('x-auth-token', token)

            expect(res.status).toBe(404)
        })

        it('Should return 404 if the customer does not exist', async () => {
            token = user.generateAuthToken()
            await Customer.findByIdAndDelete(customer._id)

            const res = await sendDeleteRequest()

            expect(res.status).toBe(404)
        })

        it('Should return 403 if not authorized', async () => {
            user.isAdmin = false
            token = user.generateAuthToken()

            const res = await sendDeleteRequest()

            expect(res.status).toBe(403)
        })

        it('Should return 401 if not authenticated', async () => {
            token = ''
            const res = await sendDeleteRequest()

            expect(res.status).toBe(401)
        })
    })
})