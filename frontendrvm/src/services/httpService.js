import axios from 'axios';
import auth from '../services/authService'
import { toast } from 'react-toastify'

axios.defaults.headers.common['x-auth-token'] = auth.getJwt()

axios.interceptors.response.use(response => response, (error) => {
    const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;
  
    if (!expectedError) {
        console.log("Logging the error", error)
        toast.error("An unexpected error ocurred.")
    }
    
    return Promise.reject(error);
}); 

export default {
    get: axios.get, 
    post: axios.post,
    put: axios.put,
    delete: axios.delete
}