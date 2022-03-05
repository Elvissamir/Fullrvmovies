const bcrypt = require('bcrypt')
const { User } = require("../../../models/User")

describe('User Model', () => {
    it("The hashPassword static method should hash the users password.", async() => {
        const password = 'password'
        const hashedPassword = await User.hashPassword(password)
        
        const result = await bcrypt.compare(password, hashedPassword)
        expect(result).toBe(true)
    })
})