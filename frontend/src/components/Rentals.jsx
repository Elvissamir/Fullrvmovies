import { useState } from 'react';
import _ from 'lodash'
import RentalsTable from './RentalsTable';
import Pagination from './common/Pagination';
import { paginate } from '../utils/paginate';
import { useEffect } from 'react';
import { getRentals } from '../services/rentalsService';

function Rentals () {
    const [ rentals, setRentals ] = useState([])
    const [ pageSize, setPageSize ] = useState(5)
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ sortColumn, setSortColumn ] = useState({ path: 'customer', order: 'asc' })

    useEffect(() => {
        const fetchRental = async () => {
            const { data } = await getRentals()
            console.log(data)
            setRentals(data)
        }

        fetchRental()
    }, [])


    const sortRentalList = (data) => {
        let list = []
        
        if (sortColumn.path === 'customer')
            list = _.orderBy(data, item => item.customer.first_name, sortColumn.order)

        else if (sortColumn.path === 'title' || sortColumn.path === 'dailyRentalRate')
            list = _.orderBy(data, items => items.movie[sortColumn.path], sortColumn.order)

        else 
            list = _.orderBy(data, sortColumn.path, sortColumn.order)

        return list
    }

    const getPagedData = () => {
        const sortedList = sortRentalList(rentals)
        const paginatedList = paginate(sortedList, currentPage, pageSize)

        return { data: paginatedList, totalCount: rentals.length }
    }

    const { data, totalCount } = getPagedData()

    const handleSort = (column) => {
        setSortColumn(column)
    }

    const handlePageChange = page => {
        setCurrentPage(page)
    }

    return (
        <div className="flex flex-col mt-8">
            <div className='flex'>
                <button className='button action-button'>New Rental</button>
            </div>
            <div className='mt-8'>
                <RentalsTable 
                    rentals={ data }
                    onSort={ handleSort }
                    sortColumn={ sortColumn }>
                </RentalsTable>
            </div>
            <div className="flex justify-center mt-4">
                <Pagination 
                    itemsCount={ totalCount } 
                    pageSize={ pageSize } 
                    currentPage={ currentPage }
                    onPageChange={ handlePageChange } />
            </div>
        </div>
    )
}

export default Rentals