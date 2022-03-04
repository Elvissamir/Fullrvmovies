import Joi from 'joi'
import { useForm } from './hooks/useForm'
import { login } from '../services/usersService';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { UserContext } from './context/userContext';
import { useLocation, useNavigate } from 'react-router-dom';

function LoginForm () {
    const navigate = useNavigate()
    const { state } = useLocation()
    const { loginUser } = useContext(UserContext)

    const dataInit = {
        email: '',
        password: ''
    }

    const dataSchema = {
        email: Joi.string().email({ tlds: {allow: false} }).required().label('Email'),
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
            const {data: jwt } = await login(formData)
            loginUser(jwt)
            navigate(state, { replace: true })
        } 
           
        catch (ex) {
            if (ex.response && ex.response.status === 400) {
                const errors = {...formErrors}
                errors.email = ex.response.data
                setFormErrors(errors)
                toast.error(`${ex.response.status} ${ex.response.data}`)
            }
        }
    }

    return (
        <div className="w-6/12 form-wrapper">
            <h1 className="form-title">Login</h1>
            <form onSubmit={ handleSubmit } className="form">
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
                    <button disabled={ validate() } className="form-button">
                        Sign In
                    </button>
                    <a className="inline-block align-baseline text-sm text-blue-500 hover:text-blue-800" href="/">
                        Forgot Password?
                    </a>
                </div>
            </form>
        </div>
    )
}

export default LoginForm