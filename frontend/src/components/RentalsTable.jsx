import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

function RentalsTable ({ rentals, sortColumn, onSort }) {
    return (
        <table className='w-full table-auto'>
            <thead>
                <tr className='text-left'>
                    <th className=''>Customer</th>
                    <th>Title</th>
                    <th>Rate</th>
                    <th>Out</th>
                    <th>Returned</th>
                    <th>Fee</th>
                </tr>
            </thead>
            <tbody>
                { rentals.map(({ _id, customer, movie, dateOut, dateReturned, rentalFee }) => 
                    <tr key={ _id }>
                        <td>{ customer.first_name + ' ' + customer.last_name }</td>
                        <td>{ movie.title.length < 20? movie.title : movie.title.slice(0, 20)+'...' }</td>
                        <td>{ movie.dailyRentalRate }</td>
                        <td>{ dateOut }</td>
                        <td>{ dateReturned }</td>
                        <td>{ rentalFee }</td>
                    </tr> 
                )}
            </tbody>
        </table>
    );
}

RentalsTable.propTypes = {
    rentals: PropTypes.array.isRequired,
    sortColumn: PropTypes.object.isRequired,
    onSort: PropTypes.func.isRequired
}

export default RentalsTable