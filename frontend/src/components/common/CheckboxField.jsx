import PropTypes from 'prop-types';

function CheckboxField ({ label, id, value, error, handleChange }) {
    return (
        <div className="form-checkbox-field">
            <input 
                onChange={ handleChange } 
                className="form-checkbox" 
                value={ value } 
                id={ id } 
                type='checkbox' />
                { error && <p className="form-error">{ error }</p> }
            <label className="form-checkbox-label" htmlFor={ id }>
                { label }
            </label>
        </div>
    )
}

CheckboxField.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    handleChange: PropTypes.func.isRequired
}

export default CheckboxField