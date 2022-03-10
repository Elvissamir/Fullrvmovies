function FormButton ({ text, validate }) {
    return (
        <button disabled={ validate() } className="form-button">
            { text }
        </button>
    )
}

export default FormButton