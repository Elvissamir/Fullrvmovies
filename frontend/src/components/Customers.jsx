import _ from 'lodash';
import { useState } from 'react';
import { useEffect } from 'react';
import { getCustomers } from '../services/customersService';
import { paginate } from '../utils/paginate';
import CustomersTable from './CustomersTable'

function Customers () {
    const [ customers, setCustomers ] = useState([])
    const [ pageSize, setPageSize ] = useState(4)
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ sortColumn, setSortColumn ] = useState({ path: 'name', order: 'asc' })

    useEffect(() => {
        const fetchCustomers = async () => {
            const { data } = await getCustomers()
            setCustomers(data)
        }

        fetchCustomers()
    }, [])

    const sortCustomersList = (list) => {
        if (sortColumn.path === 'name')
            return _.orderBy(list, customer => customer.first_name, sortColumn.order)
        
        return _.orderBy(list, sortColumn.path, sortColumn.order)
    }

    const getPagedData = () => {
        // copy customers
        const list = [ ...customers ]

        // sort
        const sortedList = sortCustomersList(list)

        // paginate
        const paginatedList = paginate(sortedList, currentPage, pageSize)

        return { data: paginatedList, totalCount: customers.length }
    }

    const { data, totalCount } = getPagedData()

    // HANDLE DATA
    const handleSort = sortColumn => {
        setSortColumn(sortColumn)
    }
    
    return (
        <div className='mt-8'>
            <CustomersTable 
                customers={ data }
                sortColumn={ sortColumn }
                onSort={ handleSort }></CustomersTable>
        </div>
    )
}

export default Customers