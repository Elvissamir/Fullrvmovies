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
        genres: [
            {
                _id: "6225f0de8a57008e6a0754fb",
                name: "Action"
            }, 
            {
                _id: "622a5c8a88f28fea0529e23a",
                name: "Drama"
            }
        ],
        dailyRentalRate: 2,
        numberInStock: 100
    },
    { 
        title: 'Spiderman', 
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
        title: 'King Arthur', 
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
        title: 'Kingdom of Heaven', 
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
        title: 'Karate Kid', 
        genres: [
            {
                _id: "622a5d5f7a9ed2be55a90d6b",
                name: "Action"
            }, 
            {
                _id: "622a5d5f7a9ed2be55a90d69",
                name: "Romance"
            }
        ],
        dailyRentalRate: 2,
        numberInStock: 100
    },
    { 
        title: 'Shrek', 
        genres: [
            {
                _id: "622a5d5f7a9ed2be55a90d6c",
                name: "Animation"
            }, 
            {
                _id: "622a5d5f7a9ed2be55a90d69",
                name: "Romance"
            }
        ],
        dailyRentalRate: 2,
        numberInStock: 100
    },
    { 
        title: 'The percs of being a wallflower', 
        genres: [
            {
                _id: "622a5d5f7a9ed2be55a90d6a",
                name: "Drama"
            }, 
            {
                _id: "622a5d5f7a9ed2be55a90d69",
                name: "Romance"
            }
        ],
        dailyRentalRate: 2,
        numberInStock: 100
    },
    { 
        title: 'The pursuit of happyness', 
        genres: [
            {
                _id: "622a5d5f7a9ed2be55a90d6a",
                name: "Drama"
            }, 
        ],
        dailyRentalRate: 2,
        numberInStock: 100
    },
]

const migration = { name: 'Movies', model: Movie, data: moviesData }

module.exports = migration