const { Genre } = require('../models/Genre')

const genresData = [
    { name: 'Adventure'},
    { name: 'Romance' },
    { name: 'Drama' },
    { name: 'Action' },
    { name: 'Animation' },
    { name: 'Thriller' },
    { name: 'Comedy' },
    { name: 'Western' },
    { name: 'Sci-fi' },
    { name: 'Documentary' },
]

const migration = { name: 'Genre', model: Genre, data: genresData }

module.exports = migration