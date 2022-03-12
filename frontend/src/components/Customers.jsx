import { useState } from 'react';
import { useEffect } from 'react';
import { getCustomers } from '../services/customersService';
import CustomersTable from './CustomersTable'

function Customers () {

    // SET DATA
    const [ customers, setCustomers ] = useState([])
    const [ sortColumn, setSortColumn ] = useState({ path: 'name', order: 'asc' })

    // FETCH DATA
    useEffect(() => {
        const fetchCustomers = async () => {
            const { data } = await getCustomers()
            console.log(data)
            setCustomers(data)
        }

        fetchCustomers()
    }, [])

    // SHOW DATA

    // HANDLE DATA
    const handleSort = () => {

    }
    
    return (
        <div className='mt-8'>
            <CustomersTable 
                customers={ customers }
                sortColumn={ sortColumn }
                onSort={ handleSort }></CustomersTable>
        </div>
    )
}

export default Customers