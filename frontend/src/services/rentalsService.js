import httpService from './httpService'
import config from '../config.json'
import authService from './authService'
import axios from 'axios'

const rentalsEndpoint = `${config.apiUrl}/rentals`
const returnsEndpoint = `${config.apiUrl}/returns`

function getRentals () {
    return httpService.get(rentalsEndpoint)
}

function saveRental (rental) {
    //console.log(axios.defaults.headers.common)
    return httpService.post(rentalsEndpoint, rental)
}

function closeRental (data) {
    return httpService.post(returnsEndpoint, data)
}

export {
    getRentals,
    saveRental,
    closeRental,
    rentalsEndpoint,
    returnsEndpoint
}