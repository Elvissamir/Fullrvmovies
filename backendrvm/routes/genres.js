const express = require('express')
const router = express.Router()
const auth = require("../middleware/auth")
const admin = require('../middleware/admin')
const validate = require('../middleware/validate')
const validateObjectId = require('../middleware/validateObjectId')
const { Genre, validateGenre } = require('../models/Genre')

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name')
    res.send(genres) 
})

router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).send('The genres does not exist')

    res.send(genre)
})

router.post('/', [ auth, validate(validateGenre) ], async (req, res) => {
    const genre = new Genre({
        name: req.body.name
    })

    await genre.save()
    
    res.send(genre)
})

router.put('/:id', [ auth, validateObjectId, validate(validateGenre) ], async (req, res) => {
    const genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).send('The genres does not exist')

    genre.name = req.body.name
    await genre.save()

    res.send(genre)
})

router.delete('/:id', [ auth, admin, validateObjectId ], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id)
    if (!genre) res.status(404).send('The genres does not exist')

    res.send(genre)
})

module.exports = router