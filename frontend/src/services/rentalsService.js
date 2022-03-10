import httpService from './httpService'
import config from '../config.json'

const rentalsEndpoint = `${config.apiUrl}/rentals`

function getRentals () {
    return httpService.get(rentalsEndpoint)
}

function saveRental (rental) {
    return httpService.post(rentalsEndpoint, rental)
}

export {
    getRentals,
    saveRental,
    rentalsEndpoint
}