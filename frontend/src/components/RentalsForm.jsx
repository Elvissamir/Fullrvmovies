import Joi from 'joi'
// Hooks
import { useState, useEffect } from 'react';
import useForm from './hooks/useForm'
import { useNavigate } from 'react-router-dom';
// Services
import { rentalsEndpoint, saveRental } from '../services/rentalsService'
import { getMovies } from '../services/moviesService'
// Components
import Form from './common/Form';
import SelectField from './common/SelectField';
import FormButton from './common/FormButton';
import FormFooter from './common/FormFooter';
import { toast } from 'react-toastify';

function RentalsForm () {
    const formSchema = {
        customerId: Joi.string().required().label('Customer Id'),
        movieId: Joi.string().required().label('Movie Id')
    }

    const dataInit = {
        customerId: '',
        movieId: ''
    }

    const navigate = useNavigate()
    //const [ movies, setMovies ] = useState([])

    const movies = [{ _id: 123, title: 'uno' }, { _id: 234, title: 'dos' }]
    const customers = [{ _id: 123, name: 'uno' }, { _id: 234, name: 'dos' }]

    mapDataToOptions(movies, "_id", "title")
    
    useEffect(() => {
        const fetchMovies = async () => {
            await getMovies()
        }

        const fetchCustomers = async () => {
            // await getCustomers()
        }
    }, [])

    
    const {
        formData,
        formErrors,
        handleChange,
        validate
    } = useForm(dataInit, formSchema)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await saveRental(formData)
            navigate(rentalsEndpoint, { replace: true })
        }
        catch (ex) {
            if (ex.response && ex.response.status >= 400 && ex.response.status < 500)
                toast.error(`${ex.response.status} ${ex.response.data}`)
        }
    }

    return (
        <Form title='Rentals Form' handleSubmit={ handleSubmit }>
            <SelectField 
                id='customerId'
                label='Customer'
                options={ customers }
                error={ formErrors.customerId }>    
            </SelectField>
            <SelectField 
                id='movieId'
                label='Movie'
                options={ movies }
                error={ formErrors.movieId }>    
            </SelectField>
            <FormFooter>
                <FormButton validate={ validate } text='Save'></FormButton>
            </FormFooter>
        </Form>
    )
}

export default RentalsForm