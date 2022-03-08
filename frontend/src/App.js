import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import useUser from './components/hooks/useUser';
import { UserContext } from './components/context/userContext';
import { ToastContainer } from "react-toastify";
import Nav from './components/Nav'
import Footer from './components/Footer.jsx'
import Movies from './components/Movies.jsx'
import Customers from './components/Customers';
import Rentals from './components/Rentals';
import NotFound from './components/NotFound';
import MovieForm from './components/MovieForm';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import RequireAuth from './components/RequireAuth';
import 'react-toastify/dist/ReactToastify.css'

function App() { 
  const { 
    currentUser, 
    setCurrentUser, 
    setCurrentUserFromToken, 
    logoutUser, 
    loginUser } = useUser() 

  useEffect(() => {
    setCurrentUserFromToken()
  }, [])

  return (
    <div className="App">
      <div className='app-container'>
        <ToastContainer />
        <UserContext.Provider value={{ currentUser, setCurrentUser, loginUser, logoutUser }}>
          <div className='app-nav'>
            < Nav />
          </div>
          <div className='app-content-container min-h-screen w-10/12 mx-auto px-2'>
            <Routes>

              <Route path='/login' element={<LoginForm />}></Route>
              <Route path='/register' element={<RegistrationForm/>}></Route> 
              <Route path='/movies' element={<Movies />}></Route>

              <Route 
                path='/movies/new' 
                element={
                  <RequireAuth redirectTo='/login' destination='/movies/new'>
                    <MovieForm />
                  </RequireAuth>} />

              <Route path='/movies/:id' element={<MovieForm />}></Route>
              <Route path='/customers' element={ <Customers /> }></Route>
              <Route path='/rentals' element={ <Rentals /> }></Route>
              <Route path='/' element={ <Movies /> }></Route>
              <Route path='*' element={ <NotFound /> }></Route>
            </Routes>
          </div>
        </UserContext.Provider>
        <div className='app-footer'>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
