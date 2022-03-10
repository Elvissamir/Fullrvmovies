import Joi from 'joi'
import useForm from './hooks/useForm'
import Form from './common/Form';
import InputField from './common/InputField';
import FormFooter from './common/FormFooter';
import FormButton from './common/FormButton';

function RentalsForm () {
    const dataInit = {
        customerId: '',
        movieId: ''
    }

    const formSchema = {
        customerId: Joi.string().required().label('Customer Id'),
        movieId: Joi.string().required().label('Movie Id')
    }
    
    const {
        formData,
        formErrors,
        handleChange,
        validate
    } = useForm(dataInit, formSchema)

    const handleSubmit = () => {

    }

    return (
        <Form title='Rentals Form' handleSubmit={ handleSubmit }>
            <InputField 
                label='Customer Id'
                id='customerId'
                type='text'
                value={ formData.customerId }
                error={ formErrors.customerId }
                handleChange={ handleChange }></InputField>
            <InputField
                label='Movie Id'
                id='movieId'
                type='text'
                value={ formData.movieId }
                error={ formErrors.movieId }
                handleChange={ handleChange }></InputField>
            <FormFooter>
                <FormButton validate={ validate } text='Save'></FormButton>
            </FormFooter>
        </Form>
    )
}

export default RentalsForm