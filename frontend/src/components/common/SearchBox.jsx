import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SearchBox ({ onChange, query }) {
    return  (      
        <div className="flex items-center">
            <label htmlFor="search">
                <FontAwesomeIcon className='mr-2' icon="search" />
            </label>
            <input 
                id='search'
                onChange={ onChange } 
                className="form-input" 
                value={ query } 
                type="text" 
                placeholder="Search..." />
        </div>

    )
}

export default SearchBox