import PropTypes from 'prop-types';
import formatDate from '../utils/formatDate';
import { Link } from 'react-router-dom';
import Table from './common/Table';

function RentalsTable ({ rentals, sortColumn, onSort, onReturn }) {
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
                <p>{ movie.title.length < 16? movie.title : movie.title.slice(0, 13) + '...' }</p>
        },
        {
            label: 'Rate',
            value: 'dailyRentalRate',
            content: ({ movie }) => 
                <p>{ movie.dailyRentalRate }</p>
        },
        {
            label: 'Out',
            value: 'dateOut',
            content: rental => 
                <p>{ rental.dateOut? formatDate(rental.dateOut) : '--'}</p>
        },
        {
            label: 'Returned',
            value: 'dateReturned',
            content: rental => 
                <p>{ rental.dateReturned? formatDate(rental.dateReturned) : '--'}</p>
        },
        {
            label: 'Total',
            value: 'rentalFee',
            content: rental => 
                <p>{ rental.rentalFee? rental.rentalFee + '$' : '--' }</p>
        },
        {
            key: 'markAsReturned', 
            content: rental => 
                <div>
                    { !rental.dateReturned?  
                        <button 
                            key={ rental._id } 
                            onClick={ () => onReturn(rental) } 
                            className="button-sm action-button">
                                Return
                        </button> : <p>--</p>
                    }
                </div>                
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