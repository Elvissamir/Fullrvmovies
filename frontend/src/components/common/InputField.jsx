import PropTypes from 'prop-types'

function InputField ({ label, id, type, value, error, handleChange }) {
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
                type={ type } />
                { error && <p className="form-error">{ error }</p> }
        </div>)
}

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    error: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
}

export default InputField