import Joi from 'joi'
import useForm from './hooks/useForm'
import { login } from '../services/usersService';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { UserContext } from './context/userContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Form from './common/Form';
import InputField from './common/InputField';
import FormFooter from './common/FormFooter';
import FormButton from './common/FormButton';
import authService from '../services/authService';

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
        <Form size='w-6/12' title='Login' handleSubmit={ handleSubmit }>
            <InputField 
                label='Email'
                id='email'
                type='text'
                value={ formData.email }
                error={ formErrors.email }
                handleChange={ handleChange } />
            <InputField 
                label='Password'
                id='password'
                type='password'
                value={ formData.password }
                error={ formErrors.password }
                handleChange={ handleChange } />
            <FormFooter>
                <FormButton text='Login' validate={ validate } />
                <a className="inline-block align-baseline text-sm text-blue-500 hover:text-blue-800" href="/">
                    Forgot Password?
                </a>
            </FormFooter>
        </Form>
    )
}

export default LoginForm