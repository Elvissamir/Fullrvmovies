import PropTypes from 'prop-types';

function SelectField ({ id, label, options, handleSelectChange, error }) {
    return (
        <div className="form-field">
            <label className="form-label" htmlFor={ id }>
                { label }
            </label>     
            <select 
                className="form-input bg-white" 
                id={ id } 
                name={ id }
                onChange={ handleSelectChange }>
                        <option hidden value="">Select { label } ...</option>
                    { options.map(option => 
                        <option 
                            key={ option.value } 
                            value={ option.value }>
                                { option.text }
                        </option>
                    )}
            </select>
            { error && <p className="form-error">{ error }</p> }
        </div>)
}

SelectField.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    error: PropTypes.string
}

export default SelectField