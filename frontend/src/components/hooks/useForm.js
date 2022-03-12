import Joi from 'joi'
import { useState } from "react"

function useForm (dataInit, formSchema) {
    const [ dataSchema, setDataSchema ] = useState(formSchema)
    const [ formData, setFormData ] = useState(dataInit)
    const [ formErrors, setFormErrors ] = useState({})

    const validate = () => {
        const schema = Joi.object(dataSchema)
        const options = { abortEarly: false }
        const { error } = schema.validate(formData, options)
    
        if (!error) return null
        
        const errors = {}
        error.details.forEach( item => errors[item.path[0]] = item.message)
        return errors
    }

    const validateProperty = ({id, value}) => {
        const obj = { [id]: value }
        const schema = Joi.object({ [id]: dataSchema[id] })
        const { error } = schema.validate(obj)
    
        return (!error) ? null:error.details[0].message
    }
    
    const handleChange = ({ target: input }) => {
        const errors = { ...formErrors }
        const errorMessage = validateProperty(input)
    
        if (errorMessage) errors[input.id] = errorMessage
        else delete errors[input.id]
        
        const data = { ...formData }
        data[input.id] = input.value
        setFormErrors(errors)
        setFormData(data)
    }

    const handleCheckboxChange = ({ target: input }) => {
        const data = { ...formData }

        if (input.checked) {
            if (Array.isArray(data[input.id])) {
                const exists = data[input.id].indexOf(input.value)
                if (exists === -1) {
                    data[input.id].push(input.value)
                }
            }
            else {
                data[input.id] = true
            }
            setFormData(data)
        }
        else {
            if (Array.isArray(data[input.id])) {
                const result = data[input.id].filter(value => value !== input.value)
                data[input.id] = result
            }
            else {     
                data[input.id] = false
            }
            setFormData(data)
        }
    }

    const handleSelectChange = ({ target: input }) => {
        const data = { ...formData }
        data[input.id] = input.value
        setFormData(data)
    }

    return { 
        validate, 
        setDataSchema,
        formData, 
        setFormData,
        formErrors,
        setFormErrors,
        handleChange, 
        handleSelectChange,
        handleCheckboxChange,
    }
}

export default useForm