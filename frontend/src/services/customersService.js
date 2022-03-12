import httpService from "./httpService";
import config from '../config.json'

const customersEndpoint = `${config.apiUrl}/customers`

function getCustomers () {
    return httpService.get(customersEndpoint)
}

function saveCustomer (customer) {
    return httpService.post(customersEndpoint, customer)
}

export {
    getCustomers,
    saveCustomer,
    customersEndpoint
}
