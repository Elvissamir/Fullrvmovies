const router = require('express').Router()
const auth = require('../middleware/auth')
const _ = require('lodash')
const { User, validateUser } = require('../models/User')
const validate = require('../middleware/validate')

router.get('/', [ auth ], async (req, res) => {
    const users = await User.find()
    res.send(users)
})

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    res.send(user)
})

router.post('/', [validate(validateUser)] ,async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already registered.')

    user = new User(_.pick(req.body, ['first_name', 'last_name', 'email', "password"]))
    user.password = await User.hashPassword(user.password)

    await user.save()

    const token = user.generateAuthToken()
    res.header('access-control-expose-headers', 'x-auth-token')
       .header('x-auth-token', token)
       .send(_.pick(user, ['_id', 'first_name', 'last_name', 'email']))
})
 
module.exports = router