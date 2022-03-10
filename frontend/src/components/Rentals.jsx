import { useState } from 'react';
import _ from 'lodash'
import RentalsTable from './RentalsTable';
import Pagination from './common/Pagination';
import { paginate } from '../utils/paginate';
import { useEffect } from 'react';
import { getRentals } from '../services/rentalsService';

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
        },
        {
            _id: 132,
            customer: { 
                _id: 1, 
                first_name: 'Alexandra',
                last_name: 'Pereira',
                phone: '123456567',
                isGold: false
            },
            movie: {
                title: 'Shrek',
                dailyRentalRate: 4
            },
            dateOut: '10-04-2022',
            dateReturned: '',
            rentalFee: 1
        },
        {
            _id: 132,
            customer: { 
                _id: 1, 
                first_name: 'Katherin',
                last_name: 'Aparicio',
                phone: '123456567',
                isGold: false
            },
            movie: {
                title: 'Wonder Woman',
                dailyRentalRate: 4
            },
            dateOut: '10-03-2022',
            dateReturned: '',
            rentalFee: 2
        },
        {
            _id: 132,
            customer: { 
                _id: 1, 
                first_name: 'Veronica',
                last_name: 'Marron',
                phone: '123456567',
                isGold: false
            },
            movie: {
                title: 'Wonder Woman',
                dailyRentalRate: 4
            },
            dateOut: '10-03-2022',
            dateReturned: '',
            rentalFee: 2
        }
    ]


    useEffect(() => {
        const fetchRental = async () => {
            const { data } = await getRentals()
            console.log(data)
        }

        fetchRental()
    }, [])

    const [ rentals, setRentals ] = useState([])
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