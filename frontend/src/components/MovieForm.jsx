import React from "react";
import useForm from "./hooks/useForm"
import Joi from 'joi';
import { useState, useEffect } from 'react';
import { getGenres } from "../services/genresService";
import { getMovieById, saveMovie } from '../services/moviesService'
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Form from './common/Form';
import InputField from './common/InputField';
import NumberField from './common/NumberField';
import FormFooter from './common/FormFooter';
import FormButton from './common/FormButton';
import CheckboxFieldList from './common/CheckboxField';

const formSchema = {
    _id: Joi.string().required().label('id'),
    title: Joi.string().max(255).required().label('Title'),
    genreIds: Joi.array().items(Joi.string()).min(1).required().label('Genres'),
    numberInStock: Joi.number().min(0).max(255).required().label('In Stock'),
    dailyRentalRate: Joi.number().min(0).max(10).required().label('Rate')
}

const dataInit = {
    _id: '',
    title: '',
    genreIds: [],
    numberInStock: 0,
    dailyRentalRate: 0
}

function MovieForm () {
    const params = useParams()
    const navigate = useNavigate()
    
    const [ genreOptions, setGenreOptions ] = useState([])
    const {
        formData,
        setDataSchema,
        setFormData,
        formErrors,
        validate,
        handleChange,
        handleCheckboxChange
    } = useForm(dataInit, formSchema)

    const mapToViewModel = movie => {
        return {
            _id: movie._id,
            title: movie.title,
            genreIds: movie.genres.map(genre => genre._id),
            numberInStock: movie.numberInStock,
            dailyRentalRate: movie.dailyRentalRate
        }
    }

    const fetchMovie = async () => {
        try {
            const { data } = await getMovieById(params.id)
            const movieData = mapToViewModel(data)
            setFormData(movieData)
        }
        catch (ex) {
            if (ex.response && ex.response.status === 404)
                return navigate('/not-found', { replace:true })
        }
    }

    const fetchGenres = async () => {
        const { data: genres } = await getGenres()
        setGenreOptions(genres)
    }

    const clearIdField = () => {
        const data = {...formData}
        delete data._id
        setFormData(data)

        const schema = {...formSchema}
        delete schema._id
        setDataSchema(schema)
    }

    useEffect(() => {
        if (params.id)
            fetchMovie()
        else
            clearIdField()
        fetchGenres()
    }, [])

    const handleSubmit = async e => {
        e.preventDefault()
        
        try {
            await saveMovie(formData)
            navigate('/movies', { replace: true })
        }
        catch (ex) {
            if (ex.response && ex.response.status >= 400 && ex.response.status < 500)
                toast.error(`${ex.response.status} ${ex.response.data}`)
        }
    }
    
    return (
        <Form size='w-7/12' title="Movie Form" handleSubmit={ handleSubmit }>
            <InputField 
                label="Title"
                id="title"
                type="text"
                value={ formData.title }
                error={ formErrors.title }
                handleChange={ handleChange } />
            <div className="form-field">
                <div className="form-label">Genre Ids</div>
                <div className="flex flex-row justify-between flex-wrap w-full">
                    { genreOptions.map(genre => 
                        <div className="w-5/12" key={ genre._id }>
                            <input 
                                onChange={ handleCheckboxChange }
                                type="checkbox" 
                                id='genreIds' 
                                checked={ formData.genreIds.indexOf(genre._id) === -1? false:true}
                                value={ genre._id } />
                            <label 
                                className="form-label ml-2" 
                                htmlFor={ genre._id }>{ genre.name }</label>
                        </div>
                    )}
                </div>
                { formErrors.genre && <p className="form-error">{ formErrors.genre }</p> }
            </div>
            <NumberField 
                label="Rental Rate"
                id="dailyRentalRate"
                min={ 1 }
                max={ 10 }
                value={ formData.dailyRentalRate }
                error={ formErrors.dailyRentalRate }
                handleChange={ handleChange } />
            <NumberField 
                label="Stock"
                id="numberInStock"
                min={ 1 }
                max={ 255 }
                value={ formData.numberInStock }
                error={ formErrors.numberInStock }
                handleChange={ handleChange } />
            <FormFooter>
                <FormButton text="Save" validate={ validate } />
            </FormFooter>
        </Form>
    )   
}

export default MovieForm