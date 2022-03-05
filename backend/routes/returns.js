const auth = require("../middleware/auth")
const validate = require('../middleware/validate')
const { Rental, validateReturn } = require("../models/Rental")
const { Movie } = require("../models/Movie")
const router = require("express").Router()

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId)

    if (!rental) return res.status(404).send('The rental does not exist')
    if (rental.dateReturned) return res.status(400).send("Already processed.")
    
    rental.return()
    await rental.save()

    await Movie.updateOne({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    })

    res.send(rental)
})

module.exports = router