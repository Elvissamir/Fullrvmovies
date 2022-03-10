
import PropTypes from 'prop-types';

function SelectField ({ id, label, options, error }) {
    return (
        <div className="form-field">
            <label className="form-label" htmlFor={ id }>
                { label }
            </label>     
            <select className="form-input" id={ id }>
                { options.map(option => 
                    <option 
                        key={option.value} 
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