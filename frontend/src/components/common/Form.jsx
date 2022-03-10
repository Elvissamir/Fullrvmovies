function Form ({ title, children, handleSubmit }) {
    return (
        <div className="form-wrapper w-6/12">
            <h1 className="form-title">{ title }</h1>
            <form onSubmit={ handleSubmit } className="form">
                { children }
            </form>
        </div>
    )
}

export default Form