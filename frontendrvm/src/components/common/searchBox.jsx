
function SearchBox ({ onChange, query }) {
    return  <input 
                onChange={ onChange } 
                className="form-input" 
                value={ query } 
                type="text" 
                placeholder="Search..." />
}

export default SearchBox