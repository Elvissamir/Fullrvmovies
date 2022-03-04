import httpService from './httpService'
import config from '../config.json'

const genresEndpoint = `${config.apiUrl}/genres`

function getGenres () {
    return httpService.get(genresEndpoint)
}

export {
    getGenres, 
}