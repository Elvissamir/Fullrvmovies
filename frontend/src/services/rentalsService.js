import httpService from './httpService'
import config from '../config.json'

const rentalsEndpoint = `${config.apiUrl}/rentals`
const returnsEndpoint = `${config.apiUrl}/returns`

function getRentals () {
    return httpService.get(rentalsEndpoint)
}

function saveRental (rental) {
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