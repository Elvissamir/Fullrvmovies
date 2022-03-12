import _ from 'lodash';
import { useState } from 'react';
import { useEffect } from 'react';
import { getCustomers } from '../services/customersService';
import { paginate } from '../utils/paginate';
import CustomersTable from './CustomersTable'
import { Link } from 'react-router-dom';
import Pagination from './common/Pagination';

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
        const list = [ ...customers ]
        const sortedList = sortCustomersList(list)
        const paginatedList = paginate(sortedList, currentPage, pageSize)

        return { data: paginatedList, totalCount: customers.length }
    }

    const { data, totalCount } = getPagedData()

    const customersCountMessage = () => {
        const countMessage = `Showing ${totalCount} customers in the database`;
        return <p>{ countMessage }</p>;
    };

    const handleSort = sortColumn => {
        setSortColumn(sortColumn)
    }

    const handlePageChange = page => {
        setCurrentPage(page)
    }

    const renderNoDataBlock = () => {
        return (
            <div className='flex flex-col justify-center mt-8'>
                <Link 
                    to='/customers/new' 
                    className='button action-button mx-auto'>New Customer</Link>
                <p className='text-center mt-8'>There are no customers to show</p>
            </div>
        )
    }

    const renderTableBlock = () => {
        return (
            <>
                <div className='flex'>
                    <Link to='/customers/new' className='button action-button'>New Customer</Link>
                </div>
                <div className='mt-8 text-center'>
                    { customersCountMessage() }
                </div>
                <div className='mt-4'>
                    <CustomersTable 
                        customers={ data }
                        sortColumn={ sortColumn }
                        onSort={ handleSort }></CustomersTable>
                </div>
                <div className='mt-4 flex justify-center'>
                    <Pagination 
                        itemsCount={ totalCount }
                        currentPage={ currentPage }
                        pageSize={ pageSize }
                        onPageChange={ handlePageChange }  />
                </div>
            </>)
    }

    return (
        <div className="flex flex-col mt-8">
            { customers.length === 0? renderNoDataBlock() : renderTableBlock()}
        </div>
    )
}

export default Customers