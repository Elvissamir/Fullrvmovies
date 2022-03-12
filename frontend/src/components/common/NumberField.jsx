import PropTypes from 'prop-types'

function NumberField ({ label, id, min, max, value, error, handleChange }) {
    return (
        <div className="form-field">
            <label className="form-label" htmlFor={ id }>
                { label }
            </label>
            <input 
                onChange={ handleChange } 
                className="form-input" 
                value={ value } 
                id={ id } 
                type='number' 
                min={ min }
                max={ max } />
                { error && <p className="form-error">{ error }</p> }
        </div>)
}

NumberField.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    value: PropTypes.any.isRequired,
    error: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
}

export default NumberField