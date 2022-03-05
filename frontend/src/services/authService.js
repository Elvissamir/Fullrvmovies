import jwtDecode from "jwt-decode";

const tokenKey = 'token'

const getJwt = () => {
    return localStorage.getItem(tokenKey)
}

const getJwtData = (token) => {
    const data = jwtDecode(token)
    return data
}

const logout = () => {
    localStorage.removeItem(tokenKey)
}

const login = (token) => {
    localStorage.setItem(tokenKey, token)
}

export default { 
    getJwt,
    getJwtData,
    login,
    logout,
}