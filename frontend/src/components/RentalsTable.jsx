import { PropTypes } from 'prop-types';
import Table from './common/Table.jsx'
import { Link } from 'react-router-dom';

function RentalsTable ({ rentals, sortColumn, onSort }) {
    const columns = [
        {
            label: 'Customer', 
            value: 'customer', 
            content: ({ customer }) => 
                <Link 
                    key={ customer._id } 
                    className='text-blue-800 underline' 
                    to={`/customer/${customer._id}`}>
                    { customer.first_name }
                </Link>
        },
        {
            label: 'Title', 
            value: 'title', 
            content: ({ movie }) => <p>{ movie.title }</p>
        },
        {  
            label: 'Rate', 
            value: 'dailyRentalRate',
            content: ({ movie }) => <p>{ movie.dailyRentalRate }</p>
        }, 
        {
            label: "Out",
            value: 'dateOut'
        },
        {
            label: 'Returned',
            value: 'dateReturned'
        },
        {
            label: 'Fee',
            value: 'rentalFee'
        }
    ]

    return (
        <Table 
            data={ rentals }
            onSort={ onSort }
            columns={ columns } 
            sortColumn={ sortColumn } />
    );
}

RentalsTable.propTypes = {
    rentals: PropTypes.array.isRequired,
    sortColumn: PropTypes.object.isRequired,
    onSort: PropTypes.func.isRequired
}

export default RentalsTable