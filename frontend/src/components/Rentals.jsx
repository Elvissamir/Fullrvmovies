import { useState } from 'react';
import _ from 'lodash'
import RentalsTable from './RentalsTable';
import Pagination from './common/Pagination';

function Rentals () {
    const rentalsArray = [
        {   
            _id: 1232,
            customer: { 
                _id: 1, 
                first_name: 'Elvis',
                last_name: 'Carrasco',
                phone: '123456567',
                isGold: false
            },
            movie: {
                title: 'The Percs of being a wallflower',
                dailyRentalRate: 1
            },
            dateOut: '10-02-2022',
            dateReturned: '15-02-2022',
            rentalFee: 5
        },
        {
            _id: 32,
            customer: { 
                _id: 1, 
                first_name: 'Soromay',
                last_name: 'Villareal',
                phone: '123456567',
                isGold: false
            },
            movie: {
                title: 'Karate Kid',
                dailyRentalRate: 2
            },
            dateOut: '19-02-2022',
            dateReturned: '',
            rentalFee: 4
        },
        {
            _id: 132,
            customer: { 
                _id: 1, 
                first_name: 'Barbara',
                last_name: 'Requena',
                phone: '123456567',
                isGold: false
            },
            movie: {
                title: 'Spiderman',
                dailyRentalRate: 4
            },
            dateOut: '10-03-2022',
            dateReturned: '',
            rentalFee: 3
        }
    ]

    const [ rentals, setRentals ] = useState(rentalsArray)
    const [ pageSize, setPageSize ] = useState(5)
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ sortColumn, setSortColumn ] = useState({ path: 'customer', order: 'asc' })

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

        return { data: sortedList, totalCount: rentals.length }
    }

    const { data, totalCount } = getPagedData()

    const handleSort = (column) => {
        setSortColumn(column)
    }

    const handlePageChange = () => {
        
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