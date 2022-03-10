import httpService from './httpService'
import config from '../config.json'

const rentalsEndpoint = `${config.apiUrl}/rentals`

function getRentals () {
    return httpService.get(rentalsEndpoint)
}

export {
    getRentals,
}