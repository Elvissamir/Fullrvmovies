import httpService from "./httpService"
import config from '../config.json'

const moviesEndpoint = `${config.apiUrl}/movies`

function movieUrl (id) {
    return `${moviesEndpoint}/${id}`
}

function getMovies () {
    return httpService.get(moviesEndpoint)
}

function getMovieById (id) {
    return httpService.get(movieUrl(id))
}

function saveMovie (movie) {
    if (movie._id) {
        const data = { ...movie }
        delete data._id
        return httpService.put(movieUrl(movie._id), data)
    }

    return httpService.post(moviesEndpoint, movie)
}

function deleteMovieById (id) {
    return httpService.delete(movieUrl(id))
}

export {
    getMovies,
    getMovieById,
    saveMovie,
    deleteMovieById,
    moviesEndpoint
}