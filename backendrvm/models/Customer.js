const mongoose = require('mongoose')
const Joi = require('joi')

// Customer Model
const Customer = mongoose.model('Customer', {
    isGold: {
        type: Boolean,
        required: true
    },
    first_name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 15
    },
    last_name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 15
    },
    phone: {
        type: String,
        required: true,
        minlength: 11,
        maxlength: 11
    }
})

const validateCustomer = (data) => {
    const dataSchema = Joi.object({
        first_name: Joi.string().min(2).max(15).required(),
        last_name: Joi.string().min(2).max(15).required(),
        phone: Joi.string().min(11).max(11).required(),
        isGold: Joi.boolean().required()
    })

    return dataSchema.validate(data)
}

module.exports = {
    Customer,
    validateCustomer,
}