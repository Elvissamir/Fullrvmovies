const { Customer } = require('../models/Customer')

const customersData = [
    { 
        first_name: 'Soromay', 
        last_name: 'Villareal',  
        isGold: true,
        phone: '04243456711'
    },
    { 
        first_name: 'Barbara', 
        last_name: 'Requena',  
        isGold: true,
        phone: '04243458411'
    },
    { 
        first_name: 'Jessica', 
        last_name: 'Torrealba',  
        isGold: false,
        phone: '04243436111'
    },
    { 
        first_name: 'Carlos', 
        last_name: 'Manzana',  
        isGold: false,
        phone: '04249836712'
    },
    { 
        first_name: 'Jose', 
        last_name: 'Tomato',  
        isGold: false,
        phone: '04243453213'
    },
]

const migration = { 
    name: 'Customers', 
    model: Customer, data: 
    customersData 
}

module.exports = migration