import PropTypes from 'prop-types'
import TableHeader from './TableHeader.jsx'
import TableBody from './TableBody.jsx'

function Table ({ data, columns, sortColumn, onSort }) {
    return (
        <table className="table table-auto w-full">
            <TableHeader 
                sortColumn={ sortColumn }
                onSort={ onSort }
                columns={ columns } />
            <TableBody 
                columns={ columns }
                data={ data } />
        </table>)
}

Table.propTypes = {
    sortColumn: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    onSort: PropTypes.func.isRequired
}

export default Table