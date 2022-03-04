import React, { useContext, useEffect, useState } from "react";
import { UserContext } from './context/userContext';
import _ from 'lodash'
// Services
import { getGenres } from "../services/genresService"
import { getMovies, deleteMovieById } from '../services/moviesService'
// Utils
import { paginate } from "../utils/paginate"
import { filterList } from '../utils/filterList'
// Components
import { Link } from 'react-router-dom'
import MoviesTable from "./moviesTable"
import FilterList from "./filterList"
import Pagination from "./common/pagination"
import SearchBox from './common/searchBox'
import { toast } from 'react-toastify';

function Movies() {

  const { currentUser } = useContext(UserContext)

  const [ genreFilters, setGenreFilters ] = useState([])
  const [ movies, setMovies ] = useState([]);
  const [ pageSize, setPageSize ] = useState(4)
  const [ currentPage, setCurrentPage ] = useState(1)
  const [ currentFilter, setCurrentFilter ] = useState('All')
  const [ sortColumn, setSortColumn ] = useState({ path: 'title', order: 'asc' }) 
  const [ searchQuery, setSearchQuery ] = useState('')

  useEffect(() => {
    const fetchGenres = async () => {
      const allOption = { _id: 1, name: 'All' }
      const { data } = await getGenres()
      const genres = [allOption, ...data]
      setGenreFilters(genres) 
    }

    const fetchMovies = async () => {
      const { data:movies } = await getMovies()
      setMovies(movies)
    }

    fetchGenres()
    fetchMovies()
  }, [])

  const search = (query, array) => {
    console.log('Search')
    return array.filter(item => item.title.toLowerCase().startsWith(query.toLowerCase()))
  }

  const getPagedData = () => {
    let list = []

    if (currentFilter !== 'none')
      list = filterList(movies, currentFilter)
    else {
      list = search(searchQuery, movies)
    }

    const sortedList = _.orderBy(list, [sortColumn.path], [sortColumn.order])
    const movieList = paginate(sortedList, currentPage, pageSize)  

    return { totalCount: list.length, data: movieList }
  }
 
  const { data, totalCount } = getPagedData()

  const handleDelete = async (movie) => {
    const originalMovies = movies
    const m = movies.filter((item) => movie._id !== item._id)
    setMovies(m) 
 
    try {
      await deleteMovieById(movie._id)
    }
    catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error(`${ex.response.status} ${ex.response.data}`)

      setMovies(originalMovies)
    }
  }

  const handleLike = (movie) => {
    const index = movies.indexOf(movie)
    const m = [...movies] 
    m[index].liked = !m[index].liked
    setMovies(m)
  }

  const handlePageChange = page => {
    setCurrentPage(page)
  }   

  const handleChangeGenreFilter = option => {
    setCurrentFilter(option)
    setCurrentPage(1)
  }

  const handleSort = sortColumn => {
    setSortColumn(sortColumn)
  }

  const handleSearch = ({target}) => {
    setCurrentFilter('none')
    setCurrentPage(1)
    setSearchQuery(target.value)
  }

  const moviesCountMessage = () => {
    const countMessage = `Showing ${totalCount} movies in the database`;
    return <p>{ countMessage }</p>;
  };

  if (movies.length === 0)
    return  (
        <div className="mt-8 mx-auto">
          {
            currentUser &&  <div className="flex justify-center">
                <Link className="button action-button" to='/movies/new'>New Movie</Link>
              </div>
          }
          <div className="text-center mt-8">There are no movies to show</div>
        </div>)

  return (
    <div className="flex justify-between mt-8 w-full">
      <div className="flex">
        <FilterList 
          activeFilter={ currentFilter }
          onSelectFilter={ handleChangeGenreFilter }
          filters={ genreFilters } />
      </div>
      <div className="flex flex-col w-9/12">
          {
            currentUser &&  <div className="flex justify-center">
                <Link className="button action-button" to='/movies/new'>New Movie</Link>
              </div>
          }
        <div className="flex mt-4">
          <SearchBox query={ searchQuery } onChange={ handleSearch } />
        </div>
        <div className="mt-4 text-left">{ moviesCountMessage() }</div>
        <div className="mt-4">
          <MoviesTable 
            movies={ data } 
            onSort={ handleSort }
            onLike={ handleLike }
            onDelete={ handleDelete }
            sortColumn={ sortColumn } />
        </div>
        <div className="flex justify-center mt-4">
          <Pagination 
            itemsCount={ totalCount } 
            pageSize={ pageSize } 
            currentPage={ currentPage }
            onPageChange={ handlePageChange } />
        </div>
      </div>
    </div>
  );
}

export default Movies;
