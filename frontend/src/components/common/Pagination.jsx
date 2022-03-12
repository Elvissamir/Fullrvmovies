import PropTypes from 'prop-types'

function Pagination ({ itemsCount, pageSize, currentPage, onPageChange }) {
    const pagesCount = Math.ceil(itemsCount / pageSize)
    const createPagesArray = (pagesCount) => {
        const pa = []
        for (let i=1; i <= pagesCount; i++)
            pa.push(i)
        return pa
    }

    const pagesArray = createPagesArray(pagesCount)

    if (pagesCount === 1) return null

    return (
        <div className="pagination">
            { pagesArray.map(page => 
                <div className="pagination-item" key={ page } >
                    <button 
                        className={ (page === currentPage)? 'active-page page-link':'page-link' } 
                        onClick={ () => onPageChange(page) }>
                            { page }
                    </button>     
                </div>
            )}    
        </div>
    )
}

Pagination.propTypes = {
    itemsCount: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired
}

export default Pagination