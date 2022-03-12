import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Joi from 'joi'
import { register } from '../services/usersService';
import useForm from "./hooks/useForm"
import { UserContext } from './context/userContext';
import { toast } from 'react-toastify';
import Form from './common/Form';
import InputField from './common/InputField';
import FormFooter from './common/FormFooter';
import FormButton from './common/FormButton';

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
        <Form size='w-6/12' title='Register' handleSubmit={ handleSubmit }>
            <InputField
                label='First Name'
                id='first_name'
                value={ formData.first_name }
                error={ formErrors.first_name }
                type='text'
                handleChange={ handleChange } />
            <InputField
                label='Last Name'
                id='first_name'
                value={ formData.last_name }
                error={ formErrors.last_name }
                type='text'
                handleChange={ handleChange } />
            <InputField
                label='Email'
                id='email'
                value={ formData.email }
                error={ formErrors.email }
                type='text'
                handleChange={ handleChange } />
            <InputField
                label='Password'
                id='password'
                value={ formData.password }
                error={ formErrors.password }
                type='text'
                handleChange={ handleChange } />
            <FormFooter>
                <FormButton text='Register' validate={ validate } />
            </FormFooter>
        </Form>
    )
}

export default RegistrationForm