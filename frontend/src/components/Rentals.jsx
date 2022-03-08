import Table from "./common/Table"
import { useState } from 'react';
import RentalsTable from './RentalsTable';

function Rentals () {
    const rentalsArray = [
        {
            customer: { 
                _id: 1, 
                first_name: 'fname A',
                last_name: 'lname A',
                phone: '123456567',
                isGold: false
            },
            movie: {
                title: 'Title',
                dailyRentalRate: 1
            },
            dateOut: '10-02-2022',
            dateReturned: '15-02-2022',
            rentalFee: 5
        },
        {
            customer: { 
                _id: 1, 
                first_name: 'fname B',
                last_name: 'lname B',
                phone: '123456567',
                isGold: false
            },
            movie: {
                title: 'Title',
                dailyRentalRate: 2
            },
            dateOut: '19-02-2022',
            dateReturned: '',
            rentalFee: 4
        },
        {
            customer: { 
                _id: 1, 
                first_name: 'fname C',
                last_name: 'lname C',
                phone: '123456567',
                isGold: false
            },
            movie: {
                title: 'Title',
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
        <div className="flex">
            <RentalsTable 
                rentals={ data }
                onSort={ handleSort }
                sortColumn={ sortColumn }>
            </RentalsTable>
        </div>
    )
}

export default Rentals