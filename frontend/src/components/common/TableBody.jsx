import _ from 'lodash'
import PropTypes from 'prop-types'

function TableBody ({ data, columns }) {
    const renderCell = (item, column) => {
        if (column.content) return column.content(item)
        return _.get(item, column.value)
    }

    return (
        <tbody>
            { data.map((item, itemIndex) => (
                <tr className="text-left" key={ itemIndex }>
                    { columns.map((column, columnIndex) => 
                        <td key={ columnIndex }>
                            { renderCell(item, column)}
                        </td>    
                    )}
                </tr>
            )) }
        </tbody>
    )
}

TableBody.propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
}

export default TableBody