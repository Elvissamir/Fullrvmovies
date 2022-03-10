function CheckboxField () {
    return (
        <div className="form-field">
            <label className="form-label" htmlFor="email">
                { label }
            </label>
            <input 
                onChange={ handleChange } 
                className="form-input" 
                value={ value } 
                id={ id } 
                type={ type } />
                { error && <p className="form-error">{ error }</p> }
        </div>
    )
}

export default CheckboxField