const router = require('express').Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const validate = require('../middleware/validate')
const validateObjectId = require('../middleware/validateObjectId')
const { Customer, validateCustomer } = require('../models/Customer')

router.get('/', async (req, res) => {
    const customers = await Customer.find()
    res.send(customers)
})

router.get('/:id', validateObjectId ,async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).send('The customer does not exist.')

    res.send(customer)
})

router.post('/', [ auth, validate(validateCustomer) ], async (req, res) => {
    const customer = new Customer({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        isGold: req.body.isGold,
    })
    
    await customer.save()

    res.send(customer)
})

router.put('/:id', [ auth, validateObjectId, validate(validateCustomer) ], async (req, res) => {
    const data = req.body
    
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).send('The customer does not exist.')

    customer.first_name = data.first_name
    customer.last_name = data.last_name
    customer.isGold = data.isGold
    customer.phone = data.phone

    await customer.save()
    res.send(customer)
})

router.delete('/:id', [ auth, admin, validateObjectId ], async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id)
    if (!customer) return res.status(404).send('The customer does not exist.')

    res.status(200).send(customer)
})

module.exports = router