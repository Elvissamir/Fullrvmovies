import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import Table from './common/Table';

function RentalsTable ({ rentals, sortColumn, onSort }) {

    const columns = [
        { 
            label: 'Customer',
            value: 'customer',
            content: ({ customer }) => 
                <Link className='text-blue-800 underline' to={`/customers/${customer._id}`}>
                    { customer.first_name + " " + customer.last_name }
                </Link>
        },
        {
            label: 'Title',
            value: 'title',
            content: ({ movie }) => 
                <p>{ movie.title.length < 20? movie.title : movie.title.slice(0, 13) + '...' }</p>
        },
        {
            label: 'Rate',
            value: 'dailyRentalRate',
            content: ({ movie }) => 
                <p>{ movie.dailyRentalRate }</p>
        },
        {
            label: 'Out',
            value: 'dateOut'
        },
        {
            label: 'Returned',
            value: 'dateReturned',
            content: rental => 
                <p>{ rental.dateReturned ? rental.dateReturned : '-'}</p>
        },
        {
            label: 'Total',
            value: 'rentalFee'
        }
    ]

    return (
        <Table 
            data={ rentals }
            columns={ columns }
            sortColumn={ sortColumn } 
            onSort={ onSort }></Table>
    );
}

RentalsTable.propTypes = {
    rentals: PropTypes.array.isRequired,
    sortColumn: PropTypes.object.isRequired,
    onSort: PropTypes.func.isRequired
}

export default RentalsTable