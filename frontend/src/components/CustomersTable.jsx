import PropTypes from 'prop-types'
import Table from './common/Table';
import { Link } from 'react-router-dom';
 
function CustomersTable ({ customers, sortColumn, onSort  }) {
    const columns = [
        {
            label: 'Name',
            value: 'name',
            content: customer => 
                <Link 
                    className='text-blue-600 underline' 
                    to={`/customers/${customer._id}`}>
                        { customer.first_name + ' ' + customer.last_name }        
                </Link>,
        },
        {
            label: 'Gold',
            value: 'isGold',
            content: customer => 
                customer.isGold? <p>True</p>:<p>False</p>
        },
        {
            label: 'Phone',
            value: 'phone'
        },
    ]

    return (
        <Table 
            data={ customers } 
            columns={ columns }
            sortColumn={ sortColumn }
            onSort={ onSort }/>
    )
}

CustomersTable.propTypes = {
    customers: PropTypes.array.isRequired,
}

export default CustomersTable