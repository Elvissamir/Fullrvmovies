import config from '../config.json'
import httpService from "./httpService"

const usersEndpoint = `${config.apiUrl}/users`
const loginEndpoint = `${config.apiUrl}/login`

function register (user) {
    return httpService.post(usersEndpoint, user)
}

function login ({ email, password }) {
    return httpService.post(`${loginEndpoint}`, { email, password })
}

export {
    register,
    login,
}