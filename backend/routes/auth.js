const router = require('express').Router()
const Joi = require('joi')
const validate = require('../middleware/validate')
const bcrypt = require('bcrypt')
const { User } = require('../models/User')

const validateLogin = (data) => {
    const loginDataSchema = Joi.object({
        email: Joi.string().min(10).max(255).email().required(),
        password: Joi.string().min(6).max(1024).required()
    })

    return loginDataSchema.validate(data)
}

router.post('/', [ validate(validateLogin) ], async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Invalid email or password')

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Invalid email or password')

    const token = user.generateAuthToken()
    res.send(token)
})

module.exports = router