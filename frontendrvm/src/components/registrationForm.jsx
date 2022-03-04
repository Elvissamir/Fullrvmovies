import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Joi from 'joi'
import { register } from '../services/usersService';
import { useForm } from "./hooks/useForm"
import { UserContext } from './context/userContext';
import { toast } from 'react-toastify';

function RegistrationForm () {
    const navigate = useNavigate()
    const { loginUser } = useContext(UserContext)

    const dataInit = {
        email: '',
        first_name: '',
        last_name: '',
        password: '',
    }

    const dataSchema = {
        email: Joi.string().required().email({ tlds: {allow: false} }).label('Email'),
        first_name: Joi.string().required().label('First name'),
        last_name: Joi.string().required().label('Last name'),
        password: Joi.string().min(6).required().label('Password')
    }

    const {
        formData,
        formErrors,
        setFormErrors,
        validate,
        handleChange
    } = useForm(dataInit, dataSchema)

    const handleSubmit = async e => {
        e.preventDefault()
   
        try {
            const response = await register(formData)
            loginUser(response.headers['x-auth-token'])
            navigate('/', { replace: true })
        }
        catch (ex) {
            if (ex.response && ex.response.status === 400) {
                const errors = { ...formErrors }
                errors.email = ex.response.data
                setFormErrors(errors)
                
                toast.error(`${ex.response.status} ${ex.response.data}`)
            }
        }
    }

    return (
        <div className="form-wrapper w-6/12">
            <h1 className="form-title">Register</h1>
            <form onSubmit={ handleSubmit } className="form">
                <div className="form-field">
                    <label className="form-label" htmlFor="first_name">
                        First name
                    </label>
                    <input onChange={ handleChange } className="form-input" value={ formData.firs_name } id="first_name" type='text' />
                    { formErrors.first_name && <p className="form-error">{ formErrors.first_name }</p> }
                </div>
                <div className="form-field">
                    <label className="form-label" htmlFor="last_name">
                        Last name
                    </label>
                    <input onChange={ handleChange } className="form-input" value={ formData.last_name } id="last_name" type='text' />
                    { formErrors.last_name && <p className="form-error">{ formErrors.last_name }</p> }
                </div>
                <div className="form-field">
                    <label className="form-label" htmlFor="email">
                        Email
                    </label>
                    <input onChange={ handleChange } className="form-input" value={ formData.email } id="email" type='email' />
                    { formErrors.email && <p className="form-error">{ formErrors.email }</p> }
                </div> 
                <div className="form-field">
                    <label className="form-label" htmlFor="password">
                        Password
                    </label>
                    <input onChange={ handleChange } value={ formData.password } className="form-input" id="password" type="password" />
                    { formErrors.password && <p className="form-error">{ formErrors.password }</p> }
                </div>
                <div className="form-footer">
                    <button disabled={ validate() } className="form-button w-full">
                        Register
                    </button>
                </div>
            </form>
        </div>
    )
}

export default RegistrationForm