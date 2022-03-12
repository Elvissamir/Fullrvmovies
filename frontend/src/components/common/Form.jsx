import PropTypes from 'prop-types';

function Form ({ title, size, children, handleSubmit }) {
    return (
        <div className={ 'form-wrapper' + ' ' + size }>
            <h1 className="form-title">{ title }</h1>
            <form onSubmit={ handleSubmit } className="form">
                { children }
            </form>
        </div>
    )
}

Form.propTypes = {
    title: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired
}

export default Form