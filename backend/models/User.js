const mongoose = require('mongoose')
const config = require('config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')

const userSchema = mongoose.Schema({
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
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 10,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

userSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

userSchema.methods.generateAuthToken = function () {
    const data = {
        _id: this._id, 
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        isAdmin: this.isAdmin }
    const token = jwt.sign(data, config.get('jwtPrivateKey'))
    return token
}

const User = mongoose.model('User', userSchema)

const validateUser = (data) => {
    const dataSchema = Joi.object({
        first_name: Joi.string().min(2).max(15).regex(/^[a-zA-Z]+$/).required(),
        last_name: Joi.string().min(2).max(15).regex(/^[a-zA-Z]+$/).required(),
        email: Joi.string().min(10).max(255).email().required(),
        password: Joi.string().min(6).max(1024).required()
    })

    return dataSchema.validate(data)
}

module.exports = {
    User,
    validateUser,
}
