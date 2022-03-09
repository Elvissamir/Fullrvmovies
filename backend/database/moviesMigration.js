const { Movie } = require('../models/Movie')

const moviesData = [
    { 
        title: 'Troy', 
        genres: [
            {
                _id: "6225f0de8a57008e6a0754fb",
                name: "Action"
            }, 
            {
                _id: "6225f0de8a57008e6a0754f9",
                name: "Romance"
            }
        ],
        dailyRentalRate: 2,
        numberInStock: 100
    },
    { 
        title: 'Gladiator', 
        genres: ["6225f0c9a7b59c997419f403", "6225f0c9a7b59c997419f402"],
        dailyRentalRate: 2,
        numberInStock: 100
    },
    { 
        title: 'Spiderman', 
        genres: ["6225f0c9a7b59c997419f403", "6225f0c9a7b59c997419f401"],
        dailyRentalRate: 2,
        numberInStock: 100
    },
    { 
        title: 'King Arthur', 
        genres: ["6225f0c9a7b59c997419f403", "6225f0c9a7b59c997419f401"],
        dailyRentalRate: 2,
        numberInStock: 100
    },
    { 
        title: 'Kingdom of Heaven', 
        genres: ["6225f0c9a7b59c997419f403", "6225f0c9a7b59c997419f401"],
        dailyRentalRate: 2,
        numberInStock: 100
    },
    { 
        title: 'Karate Kid', 
        genres: ["6225f0c9a7b59c997419f403", "6225f0c9a7b59c997419f401"],
        dailyRentalRate: 2,
        numberInStock: 100
    },
    { 
        title: 'Shrek', 
        genres: ["6225f0c9a7b59c997419f400", "6225f0c9a7b59c997419f404"],
        dailyRentalRate: 2,
        numberInStock: 100
    },
    { 
        title: 'The percs of being a wallflower', 
        genres: ["6225f0c9a7b59c997419f402", "6225f0c9a7b59c997419f401"],
        dailyRentalRate: 2,
        numberInStock: 100
    },
    { 
        title: 'The pursuit of happyness', 
        genres: ["6225f0c9a7b59c997419f402"],
        dailyRentalRate: 2,
        numberInStock: 100
    },
]

const migration = { name: 'Movies', model: Movie, data: moviesData }

module.exports = migration