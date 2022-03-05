const router = require('express').Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const { Movie, validateMovie } = require('../models/Movie')
const { Genre } = require('../models/Genre')
const validateObjectId = require('../middleware/validateObjectId')
const validate = require('../middleware/validate')

router.get('/', async (req, res) => {
    const movies = await Movie.find()
    res.send(movies)
})

router.get('/:id', [ validateObjectId ], async (req, res) => {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).send('The movie does not exist')

    res.send(movie)
})

router.post('/', [ auth, validate(validateMovie) ], async (req, res) => {
    const genres = await Genre.find().where("_id").in(req.body.genreIds).exec()

    if (genres.length != req.body.genreIds.length) 
        return res.status(404).send('The genre does not exist')
    
    let movie = new Movie({  
        title: req.body.title,
        genres: genres,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })

    await movie.save()
    res.send(movie)
})

router.put("/:id", [ auth, validate(validateMovie), validateObjectId ], async (req, res) => {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).send('The movie does not exist')    

    const genres = await Genre.find().where('_id').in(req.body.genreIds).exec()
    if (genres.length != req.body.genreIds.length)
        return res.status(404).send('The genre does not exist')

    movie.title = req.body.title
    movie.numberInStock = req.body.numberInStock
    movie.dailyRentalRate = req.body.dailyRentalRate
    movie.genres = genres

    await movie.save()
    res.send(movie)
})

router.delete('/:id', [ auth, admin, validateObjectId ], async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id)
    if (!movie) return res.status(404).send('The movie does not exist')

    res.send(movie)
})

module.exports = router