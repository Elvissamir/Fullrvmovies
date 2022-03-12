import Form from './common/Form';
import InputField from './common/InputField';
import FormFooter from './common/FormFooter';
import FormButton from './common/FormButton';
import useForm from './hooks/useForm';
import Joi from 'joi';
import CheckboxField from './common/CheckboxField';
import { toast } from 'react-toastify';
import { saveCustomer } from '../services/customersService';
import { useNavigate } from 'react-router-dom';

function CustomersForm () {
    const dataInit = {
        first_name: '',
        last_name: '', 
        isGold: false,
        phone: ''
    }

    const formSchema = {
        first_name: Joi.string().min(2).max(15).required().label('First Name'),
        last_name: Joi.string().min(2).max(15).required().label('Last Name'),
        isGold: Joi.boolean().required().default(false).label('Is Gold'),
        phone: Joi.string().min(11).max(11).required().label('Phone')
    }

    const navigate = useNavigate()

    const { 
        formData, 
        formErrors,
        handleChange, 
        handleCheckboxChange, 
        validate } = useForm(dataInit, formSchema)

    const handleSubmit = async e => {
        e.preventDefault()

        try {
            await saveCustomer(formData)
            navigate('/customers', {  replace: true })
        }
        catch (ex) {
            if (ex.response && ex.response.status >= 400 && ex.response.status < 500)
                toast.error(`${ex.response.status} ${ex.response.data}`)
        }
    }

    return (
        <Form size='w-6/12' title='Customers Form' handleSubmit={ handleSubmit } >
            <InputField
                label='First Name'
                id='first_name'
                type='text'
                value={ formData.first_name }
                error={ formErrors.first_name }
                handleChange={ handleChange } />
            <InputField
                label='Last Name'
                id='last_name'
                type='text'
                value={ formData.last_name }
                error={ formErrors.first_name }
                handleChange={ handleChange } />
            <CheckboxField
                label='Is Gold'
                id='isGold'
                value={ formData.isGold }
                error={ formErrors.isGold }
                handleChange={ handleCheckboxChange } />
            <InputField
                label='Phone'
                id='phone'
                type='text'
                value={ formData.phone }
                error={ formErrors.phone }
                handleChange={ handleChange } />
            <FormFooter>
                <FormButton text='Save' validate={ validate } />
            </FormFooter>
        </Form>
    )
}

export default CustomersForm