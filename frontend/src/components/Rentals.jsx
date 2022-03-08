import { useState } from 'react';
import RentalsTable from './RentalsTable';

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

    const [ data, setData ] = useState(rentalsArray)
    const [ sortColumn, setSortColumn ] = useState({ path: 'name', order: 'asc' })

    const handleSort = () => {
        
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
        </div>
    )
}

export default Rentals