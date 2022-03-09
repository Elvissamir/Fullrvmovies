const { Customer } = require('../models/Customer')

const customersData = [
    { 
        first_name: 'Soromay', 
        last_name: 'Villareal',  
        isGold: true,
        phone: '042434567'
    },
    { 
        first_name: 'Barbara', 
        last_name: 'Requena',  
        isGold: true,
        phone: '042434584'
    },
    { 
        first_name: 'Jessica', 
        last_name: 'Torrealba',  
        isGold: false,
        phone: '042434361'
    },
    { 
        first_name: 'Carlos', 
        last_name: 'Manzana',  
        isGold: false,
        phone: '042498367'
    },
    { 
        first_name: 'Jose', 
        last_name: 'Tomato',  
        isGold: false,
        phone: '042434532'
    },
]

const migration = { 
    name: 'Customers', 
    model: Customer, data: 
    customersData 
}

module.exports = migration