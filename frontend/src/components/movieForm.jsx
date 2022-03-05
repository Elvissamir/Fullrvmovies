import React from "react";
import { useForm } from "./hooks/useForm"
import Joi from 'joi';
import { useState, useEffect } from 'react';
import { getGenres } from "../services/genresService";
import { getMovieById, saveMovie } from '../services/moviesService'
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

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
        <div className="form-wrapper w-6/12">
            <h1 className="form-title">Movie Form</h1>
            <form onSubmit={ handleSubmit } className="form">
                <div className="form-field">
                    <label className="form-label" htmlFor="title">
                        Title
                    </label>
                    <input onChange={ handleChange } className="form-input" value={ formData.title } id="title" type='text' />
                    { formErrors.title && <p className="form-error">{ formErrors.title }</p> }
                </div>
                <div className="form-field">
                    <div className="form-label">Genres</div>
                    <div className="flex flex-row justify-between flex-wrap w-full">
                        { genreOptions.map(genre => 
                            <div className="w-5/12" key={ genre._id }>
                                <input 
                                    onChange={ handleCheckboxChange }
                                    type="checkbox" 
                                    id={genre._id}
                                    name="genreIds" 
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
                <div className="form-field">
                    <label className="form-label" htmlFor="numberInStock">
                        In Stock
                    </label>
                    <input onChange={ handleChange } value={ formData.numberInStock } className="form-input" id="numberInStock" type="number" min="0" max="255" />
                    { formErrors.numberInStock && <p className="form-error">{ formErrors.numberInStock }</p> }
                </div>
                <div className="form-field">
                    <label className="form-label" htmlFor="dailyRentalRate">
                        Rate
                    </label>
                    <input onChange={ handleChange } value={ formData.dailyRentalRate } className="form-input" id="dailyRentalRate" type="number" min="0" max="10" />
                    { formErrors.dailyRentalRate && <p className="form-error">{ formErrors.dailyRentalRate }</p> }
                </div>
                <div className="form-footer">
                    <button disabled={ validate() } className="form-button w-full">
                        Save
                    </button>
                </div>
            </form>
        </div>
    )   
}

export default MovieForm