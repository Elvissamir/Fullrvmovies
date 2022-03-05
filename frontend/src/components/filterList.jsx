import PropTypes from 'prop-types'

function FilterList ({ filters, activeFilter, onSelectFilter}) {
    return (
        <div className='filter-list'>
            { filters.map(option => 
                <button 
                    onClick={ () => onSelectFilter(option.name) }
                    key={ option._id } 
                    className={ option.name === activeFilter? 'active-filter filter-option': 'filter-option' } >
                        { option.name }
                </button>
            )}
        </div>
    )
}

FilterList.propTypes = {
    filters: PropTypes.array.isRequired,
    activeFilter: PropTypes.string.isRequired
}

export default FilterList
