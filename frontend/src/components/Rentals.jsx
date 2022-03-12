import { useState } from 'react';
import _ from 'lodash'
import RentalsTable from './RentalsTable';
import Pagination from './common/Pagination';
import { paginate } from '../utils/paginate';
import { useEffect } from 'react';
import { getRentals, closeRental } from '../services/rentalsService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function Rentals () {
    const [ rentals, setRentals ] = useState([])
    const [ pageSize, setPageSize ] = useState(5)
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ sortColumn, setSortColumn ] = useState({ path: 'customer', order: 'asc' })

    useEffect(() => {
        const fetchRental = async () => {
            const { data } = await getRentals()
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

    const rentalsCountMessage = () => {
        const countMessage = `Showing ${totalCount} movies in the database`;
        return <p>{ countMessage }</p>;
    };
    
    const handlePageChange = page => {
        setCurrentPage(page)
    }

    const handleSort = (column) => {
        setSortColumn(column)
    }

    const handleReturn = async ({ _id, customer, movie }) => {
        try {
            const { data: rental } = await closeRental({ customerId: customer._id, movieId: movie._id })
            const rentalsCopy =  [ ...rentals ]
            const index = _.findIndex(rentalsCopy, item => item._id == _id)
            rentalsCopy[index] = rental
            setRentals(rentalsCopy)
        }
        catch (ex) {
            if (ex.response && ex.response.status >= 400 && ex.response.status < 500)
                toast.error(`${ex.response.status} ${ex.response.data}`)
        }
    }

    const renderTableBlock = () => {
        return (
            <>
                <div className='flex'>
                    <Link 
                        to='/rentals/new' 
                        className='button action-button'>New Rental</Link>
                </div>
                <div>
                    <div className="mt-8 text-center">{ rentalsCountMessage() }</div>
                </div>
                <div className='mt-4'>
                    <RentalsTable 
                        rentals={ data }
                        sortColumn={ sortColumn }
                        onSort={ handleSort }
                        onReturn={ handleReturn }>
                    </RentalsTable>
                </div>
                <div className="flex justify-center mt-4">
                    <Pagination 
                        itemsCount={ totalCount } 
                        pageSize={ pageSize } 
                        currentPage={ currentPage }
                        onPageChange={ handlePageChange } />
                </div>
            </>
        )
    }

    const renderNoDataBlock = () => {
        return (
            <div className='flex flex-col justify-center mt-8'>
                <Link 
                    to='/rentals/new' 
                    className='button action-button mx-auto'>New Rental</Link>
                <p className='text-center mt-8'>There are no rentals to show</p>
            </div>
        )
    }
    
    return (
        <div className="flex flex-col mt-8">
            { rentals.length === 0? renderNoDataBlock() : renderTableBlock()}
        </div>
    )
}

export default Rentals