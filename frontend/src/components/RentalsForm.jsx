import Joi from 'joi'
// Hooks
import { useState, useEffect } from 'react';
import useForm from './hooks/useForm'
import { useNavigate } from 'react-router-dom';
// Services
import { saveRental } from '../services/rentalsService'
import { getMovies } from '../services/moviesService'
import { getCustomers } from '../services/customersService';
// Components
import Form from './common/Form';
import SelectField from './common/SelectField';
import FormButton from './common/FormButton';
import FormFooter from './common/FormFooter';
import { toast } from 'react-toastify';
// Utils
import mapDataToOptions from '../utils/mapDataToOptions';

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
    const [ movieOptions, setMovieOptions ] = useState([])
    const [ customerOptions, setCustomerOptions ] = useState([])

    useEffect(() => {
        const fetchMovies = async () => {
            const { data: movies } = await getMovies()
            setMovieOptions(mapDataToOptions(movies, '_id', 'title'))
        }

        const fetchCustomers = async () => {
            const { data } = await getCustomers()
            const customers =  data.map(customer => {
                return { 
                    _id: customer._id, 
                    name: customer.first_name + ' ' + customer.last_name
                }
            })
            setCustomerOptions(mapDataToOptions(customers, '_id', 'name'))
        }

        fetchMovies()
        fetchCustomers()
    }, [])

    
    const {
        formData,
        formErrors,
        handleSelectChange,
        validate
    } = useForm(dataInit, formSchema)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await saveRental(formData)
            navigate('/rentals', { replace: true })
        }
        catch (ex) {
            if (ex.response && ex.response.status >= 400 && ex.response.status < 500)
                toast.error(`${ex.response.status} ${ex.response.data}`)
        }
    }

    return (
        <Form size='w-6/12' title='Rentals Form' handleSubmit={ handleSubmit }>
            <SelectField 
                id='customerId'
                label='Customer'
                options={ customerOptions }
                handleSelectChange={ handleSelectChange }
                error={ formErrors.customerId }>    
            </SelectField>
            <SelectField 
                id='movieId'
                label='Movie'
                options={ movieOptions }
                handleSelectChange={ handleSelectChange }
                error={ formErrors.movieId }>    
            </SelectField>
            <FormFooter>
                <FormButton validate={ validate } text='Save'></FormButton>
            </FormFooter>
        </Form>
    )
}

export default RentalsForm